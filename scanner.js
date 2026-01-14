#!/usr/bin/env node
const net = require("net");
const os = require("os");
const chalk = require("chalk");
const Table = require("cli-table");
const ipLib = require("ip");
const async = require("async");
const { program } = require("commander");
const http = require("http");
const https = require("https");

// ==================== HYPESCAN BASE CLASS ====================
class HypeScan {
  constructor() {
    this.results = [];
    this.activeHosts = [];
    this.scannedPorts = new Map();
  }

  async tcpPing(host, port = 80, timeout = 1000) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(timeout);

      socket.on("connect", () => {
        socket.destroy();
        resolve({ ip: host, alive: true, port, method: "tcp" });
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve({ ip: host, alive: false, error: "timeout", method: "tcp" });
      });

      socket.on("error", (err) => {
        socket.destroy();
        resolve({ ip: host, alive: false, error: err.code, method: "tcp" });
      });

      socket.connect(port, host);
    });
  }

  async smartPing(host, timeout = 1500) {
    const commonPorts = [80, 443, 22, 21, 23, 25, 53, 3389];

    const promises = commonPorts.map((port) =>
      this.tcpPing(host, port, timeout)
    );
    const results = await Promise.all(promises);
    const success = results.find((r) => r.alive);

    if (success) return success;

    try {
      const http = require("http");
      const isHttpAlive = await this.httpPing(host);
      if (isHttpAlive) return { ip: host, alive: true, method: "http" };
    } catch (error) {}

    return { ip: host, alive: false, error: "all methods failed" };
  }

  async httpPing(host, timeout = 2000) {
    return new Promise((resolve) => {
      const http = require("http");
      const options = {
        hostname: host,
        port: 80,
        path: "/",
        method: "HEAD",
        timeout: timeout,
      };

      const req = http.request(options, (res) => {
        req.destroy();
        resolve(true);
      });

      req.on("timeout", () => {
        req.destroy();
        resolve(false);
      });

      req.on("error", () => {
        resolve(false);
      });

      req.end();
    });
  }

  detectInterfaces() {
    console.log(
      chalk.hex("#FF6B6B").bold("╔══════════════════════════════════════╗")
    );
    console.log(
      chalk.hex("#FF6B6B").bold("║        NETWORK INTERFACES            ║")
    );
    console.log(
      chalk.hex("#FF6B6B").bold("╚══════════════════════════════════════╝")
    );

    const interfaces = os.networkInterfaces();
    const activeInterfaces = [];

    Object.keys(interfaces).forEach((ifaceName) => {
      interfaces[ifaceName].forEach((iface) => {
        if (iface.family === "IPv4" && !iface.internal) {
          console.log(chalk.hex("#4ECDC4")(`\n┌─📡 ${ifaceName}`));
          console.log(
            chalk.hex("#45B7D1")(
              `├─ IP: ${chalk.hex("#96CEB4")(iface.address)}`
            )
          );
          console.log(chalk.hex("#45B7D1")(`├─ Netmask: ${iface.netmask}`));
          console.log(chalk.hex("#45B7D1")(`└─ MAC: ${iface.mac}`));

          try {
            const subnet = ipLib.subnet(iface.address, iface.netmask);
            console.log(
              chalk.hex("#FECA57")(
                `  └─ Network: ${chalk.hex("#FF9FF3")(subnet.networkAddress)}/${
                  subnet.subnetMaskLength
                }`
              )
            );
            activeInterfaces.push({
              name: ifaceName,
              ip: iface.address,
              network: `${subnet.networkAddress}/${subnet.subnetMaskLength}`,
              subnet: subnet,
            });
          } catch (error) {
            console.log(chalk.red("  └─ Network: Calculation failed"));
          }
        }
      });
    });

    return activeInterfaces;
  }

  generateIPList(networkCIDR) {
    try {
      const subnet = ipLib.cidrSubnet(networkCIDR);
      const ipList = [];

      const ipToInt = (ip) =>
        ip.split(".").reduce((int, octet) => (int << 8) + parseInt(octet), 0);
      const intToIp = (int) =>
        [
          (int >>> 24) & 255,
          (int >>> 16) & 255,
          (int >>> 8) & 255,
          int & 255,
        ].join(".");

      const start = ipToInt(subnet.firstAddress) + 1;
      const end = ipToInt(subnet.lastAddress) - 1;

      for (let i = 0; i <= end - start; i++) {
        ipList.push(intToIp(start + i));
      }

      return ipList;
    } catch (error) {
      console.log(chalk.red(`Error: ${error.message}`));
      return [];
    }
  }

  async scanNetwork(networkCIDR, options = {}) {
    const { concurrency = 254, timeout = 2000, scanPorts = false } = options;

    console.log(
      chalk.hex("#FF9FF3").bold("\n╔══════════════════════════════════════╗")
    );
    console.log(
      chalk
        .hex("#FF9FF3")
        .bold(`║      HYPER SCANNING: ${networkCIDR.padEnd(15)} ║`)
    );
    console.log(
      chalk.hex("#FF9FF3").bold("╚══════════════════════════════════════╝")
    );

    const ipList = this.generateIPList(networkCIDR);

    if (ipList.length === 0) {
      console.log(chalk.red("No valid IPs to scan"));
      return;
    }

    console.log(
      chalk.hex("#54A0FF")(
        `🔮 Scanning ${ipList.length} IPs with ${concurrency} threads...`
      )
    );
    console.log(
      chalk
        .hex("#5F27CD")
        .italic("💫 Live feedback: ● = online, . = offline, ✨ = ports found\n")
    );

    this.results = [];
    this.activeHosts = [];

    const startTime = Date.now();
    let scannedCount = 0;

    try {
      await async.mapLimit(ipList, concurrency, async (ip) => {
        const result = await this.smartPing(ip, timeout);
        scannedCount++;

        const progress = Math.floor((scannedCount / ipList.length) * 50);
        const progressBar = "█".repeat(progress) + "░".repeat(50 - progress);
        const percentage = Math.floor((scannedCount / ipList.length) * 100);

        process.stdout.write(
          `\r${chalk.hex("#00D2D3")(`[${progressBar}]`)} ${chalk.hex("#FF9F43")(
            `${percentage}%`
          )} `
        );

        if (result.alive) {
          this.activeHosts.push(ip);

          if (scanPorts) {
            const openPorts = await this.scanCommonPorts(ip);
            if (openPorts.length > 0) {
              this.scannedPorts.set(ip, openPorts);
              process.stdout.write(chalk.hex("#FF9FF3")("✨"));
            } else {
              process.stdout.write(chalk.hex("#00D2D3")("●"));
            }
          } else {
            process.stdout.write(chalk.hex("#00D2D3")("●"));
          }
        } else {
          process.stdout.write(chalk.hex("#576574")("."));
        }

        this.results.push(result);
        return result;
      });

      const endTime = Date.now();
      const scanTime = ((endTime - startTime) / 1000).toFixed(2);

      console.log(
        chalk
          .hex("#1DD1A1")
          .bold(`\n\n🎉 Scan completed in ${scanTime} seconds!`)
      );
      console.log(chalk.hex("#FF9FF3")("═".repeat(60)));
      this.displayResults();
    } catch (error) {
      console.log(chalk.red(`\nScan error: ${error.message}`));
    }
  }

  async scanCommonPorts(ip, timeout = 800) {
    const commonPorts = [
      { port: 21, service: "FTP", emoji: "📁" },
      { port: 22, service: "SSH", emoji: "🔐" },
      { port: 23, service: "Telnet", emoji: "📠" },
      { port: 25, service: "SMTP", emoji: "✉️" },
      { port: 53, service: "DNS", emoji: "🌐" },
      { port: 80, service: "HTTP", emoji: "🌍" },
      { port: 110, service: "POP3", emoji: "📨" },
      { port: 143, service: "IMAP", emoji: "📧" },
      { port: 443, service: "HTTPS", emoji: "🔒" },
      { port: 445, service: "SMB", emoji: "💻" },
      { port: 3389, service: "RDP", emoji: "🖥️" },
      { port: 5900, service: "VNC", emoji: "👁️" },
      { port: 8080, service: "HTTP-Alt", emoji: "🌀" },
    ];

    const openPorts = [];
    await async.eachLimit(commonPorts, 8, async ({ port, service, emoji }) => {
      const isOpen = await this.checkPort(ip, port, timeout);
      if (isOpen) openPorts.push({ port, service, emoji });
    });

    return openPorts;
  }

  async checkPort(ip, port, timeout = 800) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(timeout);

      socket.on("connect", () => {
        socket.destroy();
        resolve(true);
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve(false);
      });

      socket.on("error", () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(port, ip);
    });
  }

  displayResults() {
    console.log(
      chalk
        .hex("#FF9F43")
        .bold(`🎯 Found ${this.activeHosts.length} active hosts`)
    );

    if (this.activeHosts.length === 0) {
      console.log(chalk.hex("#FF6B6B")("😢 No active hosts found"));
      return;
    }

    const table = new Table({
      head: [
        chalk.hex("#FF9FF3")("#"),
        chalk.hex("#54A0FF")("IP Address"),
        chalk.hex("#00D2D3")("Status"),
        chalk.hex("#FF9F43")("Open Ports"),
      ],
      colWidths: [4, 18, 12, 40],
      chars: {
        top: "═",
        "top-mid": "╤",
        "top-left": "╔",
        "top-right": "╗",
        bottom: "═",
        "bottom-mid": "╧",
        "bottom-left": "╚",
        "bottom-right": "╝",
        left: "║",
        "left-mid": "╟",
        mid: "─",
        "mid-mid": "┼",
        right: "║",
        "right-mid": "╢",
        middle: "│",
      },
    });

    this.activeHosts.sort((a, b) => {
      const aParts = a.split(".").map(Number);
      const bParts = b.split(".").map(Number);
      for (let i = 0; i < 4; i++) {
        if (aParts[i] !== bParts[i]) return aParts[i] - bParts[i];
      }
      return 0;
    });

    this.activeHosts.forEach((ip, index) => {
      const openPorts = this.scannedPorts.get(ip) || [];
      const portStr =
        openPorts.length > 0
          ? openPorts.map((p) => `${p.emoji} ${p.port}`).join(" ")
          : chalk.hex("#576574")("No ports scanned");

      table.push([
        chalk.hex("#FF9FF3")(index + 1),
        chalk.hex("#96CEB4").bold(ip),
        chalk.hex("#1DD1A1").bold("🟢 ONLINE"),
        chalk.hex("#FECA57")(portStr),
      ]);
    });

    console.log(table.toString());
    this.displaySummary();
  }

  displaySummary() {
    console.log(chalk.hex("#5F27CD").bold("\n📊 SCAN SUMMARY"));
    console.log(chalk.hex("#FF9FF3")("─".repeat(40)));

    const totalScanned = this.results.length;
    const activeCount = this.activeHosts.length;
    const inactiveCount = totalScanned - activeCount;
    const successRate =
      totalScanned > 0 ? ((activeCount / totalScanned) * 100).toFixed(1) : 0;

    console.log(chalk.hex("#54A0FF")(`📡 Total IPs scanned: ${totalScanned}`));
    console.log(chalk.hex("#1DD1A1")(`✅ Active hosts: ${activeCount}`));
    console.log(chalk.hex("#FF6B6B")(`❌ Inactive hosts: ${inactiveCount}`));
    console.log(chalk.hex("#FF9F43")(`📈 Success rate: ${successRate}%`));

    if (this.scannedPorts.size > 0) {
      console.log(chalk.hex("#FF9FF3").bold("\n🔓 PORT DISCOVERY"));
      console.log(chalk.hex("#5F27CD")("─".repeat(40)));

      let totalPorts = 0;
      this.scannedPorts.forEach((ports, ip) => {
        console.log(
          chalk.hex("#96CEB4")(`  ${ip}: `) +
            chalk.hex("#FECA57")(`${ports.length} open ports `) +
            ports.map((p) => p.emoji).join(" ")
        );
        totalPorts += ports.length;
      });

      console.log(chalk.hex("#FF9F43")(`\n  Total open ports: ${totalPorts}`));
    }

    console.log(chalk.hex("#00D2D3")("\n✨ HypeScan completed successfully!"));
  }

  getServiceName(port) {
    const services = {
      22: "SSH",
      80: "HTTP",
      443: "HTTPS",
      3000: "React/Node Dev Server",
      5000: "Flask Dev Server",
      8000: "Django Dev Server",
      8080: "Tomcat/Dev Server",
      3306: "MySQL",
      5432: "PostgreSQL",
      27017: "MongoDB",
      6379: "Redis",
      9200: "Elasticsearch",
      3389: "RDP",
      5900: "VNC",
    };

    return services[port] || `Service ${port}`;
  }
}

// ==================== CAFE SCANNER (EXTENDS HYPESCAN) ====================
class CafeScanner extends HypeScan {
  constructor() {
    super();
    this.deviceProfiles = new Map();
  }

  async detectWebService(ip) {
    const webPorts = [80, 443, 8080, 8443, 3000, 5000, 8000];
    const detected = [];

    for (const port of webPorts) {
      try {
        const isOpen = await this.checkPort(ip, port, 1500);
        if (isOpen) {
          detected.push({ port, service: this.getServiceName(port) });
        }
      } catch (error) {}
    }

    return detected;
  }

  async detectDevService(ip) {
    const devPorts = [
      {
        port: 3000,
        service: "React/Node Dev Server",
        devType: "JavaScript Developer",
      },
      { port: 5000, service: "Flask Dev Server", devType: "Python Developer" },
      { port: 8000, service: "Django Dev Server", devType: "Python Developer" },
      { port: 8080, service: "Java/Tomcat", devType: "Java Developer" },
      {
        port: 4200,
        service: "Angular Dev Server",
        devType: "Angular Developer",
      },
      { port: 5173, service: "Vite Dev Server", devType: "Frontend Developer" },
    ];

    const detected = [];
    for (const service of devPorts) {
      try {
        const isOpen = await this.checkPort(ip, service.port, 1500);
        if (isOpen) {
          detected.push(service);
        }
      } catch (error) {}
    }

    return detected;
  }

  async profileDevice(ip) {
    const profile = {
      ip: ip,
      services: [],
      deviceType: "Unknown",
      developerType: null,
      riskLevel: "low",
      lastSeen: new Date().toISOString(),
    };

    const webServices = await this.detectWebService(ip);
    const devServices = await this.detectDevService(ip);

    if (webServices.length > 0) {
      profile.services.push(...webServices.map((s) => `Web:${s.port}`));

      const flaskService = webServices.find((s) => s.port === 5000);
      if (flaskService) {
        profile.deviceType = "Development Machine";
        profile.developerType = "Python Developer";
        profile.riskLevel = "medium";
      }
    }

    if (devServices.length > 0) {
      profile.services.push(
        ...devServices.map((dev) => `${dev.service}:${dev.port}`)
      );
      profile.deviceType = "Active Development";
      profile.developerType = devServices[0].devType;
      profile.riskLevel = "medium";
    }

    if (profile.services.length === 0) {
      const isAlive = await this.smartPing(ip);
      if (isAlive.alive) {
        profile.deviceType = "Generic Device";
        profile.services.push("Pingable");
      }
    }

    this.deviceProfiles.set(ip, profile);
    return profile;
  }

  async scanCafeNetwork() {
    console.log(
      chalk.hex("#FF6B6B").bold("\n╔══════════════════════════════════════╗")
    );
    console.log(
      chalk.hex("#FF6B6B").bold("║      ☕ CAFE NETWORK SCANNER         ║")
    );
    console.log(
      chalk.hex("#FF6B6B").bold("╚══════════════════════════════════════╝")
    );

    console.log(
      chalk.yellow.bold(`
⚖️  ETHICAL GUIDELINES:
1. ⚠️  ONLY SCAN NETWORKS YOU OWN OR HAVE PERMISSION
2. 🔒 Do not access devices without authorization
3. 📚 This tool is for LEARNING PURPOSES ONLY
`)
    );

    const interfaces = this.detectInterfaces();
    if (interfaces.length === 0) {
      console.log(chalk.red("❌ No network interface found!"));
      return;
    }

    const primaryNetwork = interfaces[0].network;
    console.log(
      chalk.hex("#54A0FF")(`\n📍 Detected network: ${primaryNetwork}`)
    );
    console.log(chalk.hex("#FF9F43")("🔍 Scanning for active devices...\n"));

    await this.scanNetwork(primaryNetwork, {
      concurrency: 100,
      timeout: 2000,
      scanPorts: true,
    });

    if (this.activeHosts.length === 0) {
      console.log(chalk.red("😢 No active devices found"));
      return;
    }

    console.log(
      chalk.hex("#00D2D3").bold("\n🔬 Profiling detected devices...")
    );

    const deviceProfiles = [];
    for (let i = 0; i < this.activeHosts.length; i++) {
      const ip = this.activeHosts[i];
      process.stdout.write(chalk.hex("#FF9F43")(`\n  ${i + 1}. ${ip} `));

      const profile = await this.profileDevice(ip);
      deviceProfiles.push(profile);

      const emoji =
        profile.riskLevel === "high"
          ? "⚠️ "
          : profile.riskLevel === "medium"
          ? "🔸"
          : "✅";

      console.log(chalk.hex("#96CEB4")(`${emoji} ${profile.deviceType}`));

      if (profile.developerType) {
        console.log(chalk.hex("#FECA57")(`     👨‍💻 ${profile.developerType}`));
      }

      if (profile.services.length > 0) {
        console.log(
          chalk.hex("#576574")(
            `     🛠️  ${profile.services.slice(0, 3).join(", ")}`
          )
        );
      }
    }

    this.displayCafeAnalysis(deviceProfiles);
  }

  displayCafeAnalysis(devices) {
    console.log(
      chalk.hex("#5F27CD").bold("\n╔══════════════════════════════════════╗")
    );
    console.log(
      chalk.hex("#5F27CD").bold("║        CAFE NETWORK ANALYSIS         ║")
    );
    console.log(
      chalk.hex("#5F27CD").bold("╚══════════════════════════════════════╝")
    );

    const totalDevices = devices.length;
    const developerDevices = devices.filter((d) => d.developerType);
    const webServers = devices.filter((d) =>
      d.services.some((s) => s.includes("Web:"))
    );

    console.log(chalk.hex("#54A0FF")(`\n📊 Statistics:`));
    console.log(chalk.hex("#00D2D3")(`   Total devices: ${totalDevices}`));
    console.log(
      chalk.hex("#1DD1A1")(`   Developer machines: ${developerDevices.length}`)
    );
    console.log(chalk.hex("#FF9FF3")(`   Web servers: ${webServers.length}`));

    if (developerDevices.length > 0) {
      console.log(
        chalk.hex("#FF9F43").bold("\n👨‍💻 Developer Activity Detected:")
      );

      const devTypes = {};
      developerDevices.forEach((dev) => {
        devTypes[dev.developerType] = (devTypes[dev.developerType] || 0) + 1;
      });

      Object.entries(devTypes).forEach(([type, count]) => {
        const emoji = type.includes("Python")
          ? "🐍"
          : type.includes("JavaScript")
          ? "🟨"
          : type.includes("Java")
          ? "☕"
          : "💻";

        console.log(
          chalk.hex("#96CEB4")(`   ${emoji} ${type}: ${count} device(s)`)
        );
      });

      const flaskDevices = developerDevices.filter(
        (d) => d.developerType === "Python Developer"
      );

      if (flaskDevices.length > 0) {
        console.log(
          chalk.hex("#FF9FF3").bold("\n🎯 Potential Flask Development:")
        );
        flaskDevices.forEach((device) => {
          console.log(chalk.hex("#FECA57")(`   • ${device.ip}`));
        });
      }
    }

    console.log(chalk.hex("#00D2D3")("\n✨ Cafe scan completed!"));
  }

  async findFlaskServers() {
    console.log(chalk.hex("#FF6B6B").bold("\n🔍 HUNTING FOR FLASK SERVERS..."));

    const interfaces = this.detectInterfaces();
    const network = interfaces[0]?.network;

    if (!network) {
      console.log(chalk.red("❌ No network found"));
      return;
    }

    console.log(
      chalk.hex("#54A0FF")(`Scanning ${network} for Flask on port 5000...\n`)
    );

    const subnet = ipLib.cidrSubnet(network);
    const start = this.ipToLong(subnet.firstAddress) + 1;
    const end = this.ipToLong(subnet.lastAddress) - 1;

    const flaskServers = [];

    for (let i = start; i <= end; i++) {
      const ip = this.longToIp(i);
      const progress = Math.floor(((i - start) / (end - start)) * 40);
      const bar = "█".repeat(progress) + "░".repeat(40 - progress);

      process.stdout.write(`\r${chalk.hex("#FF9F43")(`[${bar}]`)} ${ip} `);

      const isFlask = await this.checkPort(ip, 5000, 1500);
      if (isFlask) {
        flaskServers.push(ip);
        process.stdout.write(chalk.green("🎯 FLASK!"));
      } else {
        process.stdout.write(chalk.gray("."));
      }
    }

    console.log(
      chalk
        .hex("#1DD1A1")
        .bold(`\n\n🎉 Found ${flaskServers.length} Flask servers:`)
    );
    flaskServers.forEach((ip) => {
      console.log(chalk.hex("#00D2D3")(`  • ${ip}:5000`));
    });
  }

  ipToLong(ip) {
    return ip
      .split(".")
      .reduce((int, octet) => (int << 8) + parseInt(octet), 0);
  }

  longToIp(int) {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255,
    ].join(".");
  }
}

// ==================== COMMAND LINE INTERFACE ====================
function setupCLI() {
  //     console.log(chalk.hex('#FF9FF3').bold(`
  // ╔══════════════════════════════════════════════╗
  // ║                ▄▄▄▄▄▄▄▄▄▄▄▄▄                 ║
  // ║                ██▀▀▀▀▀▀▀▀██                 ║
  // ║                ██  HypeScan+ ██                 ║
  // ║                ██  ☕ Pro    ██                 ║
  // ║                ██▄▄▄▄▄▄▄▄▄▄██                 ║
  // ║                ▀▀▀▀▀▀▀▀▀▀▀▀▀                 ║
  // ║      ⚡ Network Intelligence Scanner ⚡       ║
  // ╚══════════════════════════════════════════════╝`));

  console.log(
    chalk.hex("#FF6B6B")(
      "      ___           ___           ___           ___           ___           ___           ___           ___     "
    )
  );
  console.log(
    chalk.hex("#FF9F43")(
      "     /\\__\\         |\\__\\         /\\  \\         /\\  \\         /\\  \\         /\\  \\         /\\  \\         /\\__\\    "
    )
  );
  console.log(
    chalk.hex("#FECA57")(
      "    /:/  /         |:|  |       /::\\  \\       /::\\  \\       /::\\  \\       /::\\  \\       /::\\  \\       /::|  |   "
    )
  );
  console.log(
    chalk.hex("#FF9FF3")(
      "   /:/__/          |:|  |      /:/\\:\\  \\     /:/\\:\\  \\     /:/\\ \\  \\     /:/\\:\\  \\     /:/\\:\\  \\     /:|:|  |   "
    )
  );
  console.log(
    chalk.hex("#54A0FF")(
      "  /::\\  \\ ___      |:|__|__   /::\\~\\:\\  \\   /::\\~\\:\\  \\   _\\:\\~\\ \\  \\   /:/  \\:\\  \\   /::\\~\\:\\  \\   /:/|:|  |__ "
    )
  );
  console.log(
    chalk.hex("#5F27CD")(
      " /:/\\:\\  /\\__\\     /::::\\__\\ /:/\\:\\ \\:\\__\\ /:/\\:\\ \\:\\__\\ /\\ \\:\\ \\ \\__\\ /:/__/ \\:\\__\\ /:/\\:\\ \\:\\__\\ /:/ |:| /\\__\\"
    )
  );
  console.log(
    chalk.hex("#00D2D3")(
      " \\/__\\:\\/:/  /    /:/~~/~    \\/__\\:\\/:/  / \\:\\~\\:\\ \\/__/ \\:\\ \\:\\ \\/__/ \\:\\  \\  \\/__/ \\/__\\:\\/:/  / \\/__|:|/:/  /"
    )
  );
  console.log(
    chalk.hex("#1DD1A1")(
      "      \\::/  /    /:/  /           \\::/  /   \\:\\ \\:\\__\\    \\:\\ \\:\\__\\    \\:\\  \\            \\::/  /      |:/:/  / "
    )
  );
  console.log(
    chalk.hex("#96CEB4")(
      "      /:/  /     \\/__/             \\/__/     \\:\\ \\/__/     \\:\\/:/  /     \\:\\  \\           /:/  /       |::/  /  "
    )
  );
  console.log(
    chalk.hex("#4ECDC4")(
      "     /:/  /                                   \\:\\__\\        \\::/  /       \\:\\__\\         /:/  /        /:/  /   "
    )
  );
  console.log(
    chalk.hex("#576574")(
      "     \\/__/                                     \\/__/         \\/__/         \\/__/         \\/__/         \\/__/    "
    )
  );

  program
    .name("hypescan-plus")
    .description("⚡ HypeScan+ - Advanced Network Scanner with Cafe Features")
    .version("2.0.0");

  // Original commands
  program
    .command("scan")
    .description("Scan a network")
    .option("-n, --network <cidr>", "Network CIDR", "192.168.1.0/24")
    .option("-c, --concurrency <number>", "Threads", "50")
    .option("-p, --ports", "Enable port scanning")
    .action(async (options) => {
      const scanner = new HypeScan();
      await scanner.scanNetwork(options.network, {
        concurrency: parseInt(options.concurrency),
        scanPorts: options.ports,
      });
    });

  program
    .command("interfaces")
    .description("Show network interfaces")
    .action(() => {
      const scanner = new HypeScan();
      scanner.detectInterfaces();
    });

  // Cafe commands
  program
    .command("cafe")
    .description("Scan cafe network for developers and services")
    .action(async () => {
      const scanner = new CafeScanner();
      await scanner.scanCafeNetwork();
    });

  program
    .command("find-flask")
    .description("Find Flask development servers")
    .action(async () => {
      const scanner = new CafeScanner();
      await scanner.findFlaskServers();
    });

  program
    .command("find-devs")
    .description("Find developer machines")
    .action(async () => {
      const scanner = new CafeScanner();
      const interfaces = scanner.detectInterfaces();
      const network = interfaces[0]?.network;

      if (!network) {
        console.log(chalk.red("❌ No network found"));
        return;
      }

      console.log(
        chalk.hex("#54A0FF")(`🔍 Looking for developers in ${network}`)
      );

      await scanner.scanNetwork(network, { concurrency: 100, scanPorts: true });

      const developerIPs = [];
      for (const ip of scanner.activeHosts) {
        const profile = await scanner.profileDevice(ip);
        if (profile.developerType) {
          developerIPs.push({ ip, profile });
        }
      }

      if (developerIPs.length > 0) {
        console.log(
          chalk.hex("#FF9FF3").bold("\n👨‍💻 DEVELOPER MACHINES FOUND:")
        );
        developerIPs.forEach(({ ip, profile }) => {
          console.log(chalk.hex("#00D2D3")(`\n  ${ip}`));
          console.log(
            chalk.hex("#96CEB4")(`    Type: ${profile.developerType}`)
          );
          console.log(
            chalk.hex("#FECA57")(`    Services: ${profile.services.join(", ")}`)
          );
        });
      } else {
        console.log(chalk.red("\n😢 No developer machines found"));
      }
    });

  program
    .command("deepscan")
    .description("Deep scan specific IP")
    .argument("<ip>", "Target IP address")
    .action(async (ip) => {
      const scanner = new HypeScan();

      console.log(chalk.hex("#FF9FF3").bold(`\n🎯 DEEP SCAN: ${ip}`));
      console.log(chalk.hex("#54A0FF")("═".repeat(40)));

      const isAlive = await scanner.smartPing(ip);
      if (!isAlive.alive) {
        console.log(chalk.red("❌ Device is not responding"));
        return;
      }

      console.log(chalk.green("✅ Device is online"));

      const commonPorts = [
        21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3389, 5900, 8080,
      ];
      console.log(chalk.hex("#FF9F43")("\n🔍 Scanning ports...\n"));

      const openPorts = [];
      for (const port of commonPorts) {
        process.stdout.write(`Port ${port.toString().padEnd(5)}... `);
        const isOpen = await scanner.checkPort(ip, port);

        if (isOpen) {
          console.log(chalk.green("OPEN"));
          openPorts.push(port);
        } else {
          console.log(chalk.red("CLOSED"));
        }
      }

      console.log(
        chalk.hex("#1DD1A1").bold(`\n🎊 Found ${openPorts.length} open ports`)
      );

      if (openPorts.includes(5000)) {
        console.log(
          chalk.hex("#FF9FF3").bold("\n🎯 FLASK SERVER DETECTED on port 5000!")
        );
      }
    });

  program.parse();
}

if (require.main === module) {
  setupCLI();
}

module.exports = { HypeScan, CafeScanner };
