# hypescanner
# **HypeScan - ⚡ Hyper-Fast Network Intelligence Scanner**

<div align="center">

![HypeScan Banner](https://img.shields.io/badge/HypeScan-Network_Scanner-FF6B6B?style=for-the-badge&logo=terminal&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Discover, Scan, and Analyze Networks with Stunning Visual Feedback**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/hypescan?style=social)](https://github.com/yourusername/hypescan)
[![Downloads](https://img.shields.io/npm/dt/hypescan?color=blue&style=flat-square)](https://npmjs.com/package/hypescan)

</div>

---

## 🎯 **What is HypeScan?**

HypeScan is a **next-generation network scanner** built with Node.js that combines blazing-fast performance with beautiful terminal visuals. Unlike traditional scanners, HypeScan provides **real-time visual feedback** with progress bars, emojis, and color-coded results that make network scanning both informative and enjoyable.

Perfect for **security researchers**, **network administrators**, **developers**, and **CTF enthusiasts** who need powerful scanning capabilities with an intuitive interface.

---

## ✨ **Features That Pop**

### 🚀 **Hyper-Fast Scanning**
- **Concurrent scanning** up to 254 threads
- **TCP-based ping** (no ICMP permissions needed)
- **Smart port detection** with multiple fallback methods
- **Real-time progress** with animated progress bars

### 🎨 **Visual Experience**
- **Color-coded results** with gradient effects
- **Live feedback**: ● = online, . = offline, ✨ = ports found
- **Beautiful ASCII art** banners and tables
- **Emoji-rich output** for quick visual recognition

### 🔍 **Intelligent Detection**
- **Auto-network detection** from active interfaces
- **Port service identification** with emoji indicators
- **Device profiling** and service categorization
- **Cafe/coffeeshop mode** for developer detection

### 📊 **Comprehensive Reporting**
- **Interactive tables** with CLI-table
- **Scan summaries** with statistics
- **JSON export** for further analysis
- **Multi-network scanning** support

---

## 🖥️ **Screenshots**

### **Main Interface**
```
╔══════════════════════════════════════╗
║                ▄▄▄▄▄▄▄▄▄▄▄▄▄         ║
║                ██▀▀▀▀▀▀▀▀██         ║
║                ██  HypeScan ██       ║
║                ██▄▄▄▄▄▄▄▄▄▄██       ║
║                ▀▀▀▀▀▀▀▀▀▀▀▀▀         ║
║      ⚡ Hyper-Fast Network Scanner ⚡ ║
╚══════════════════════════════════════╝
```

### **Live Scanning**
```
🔮 Scanning 254 IPs with 50 threads...
💫 Live feedback: ● = online, . = offline, ✨ = ports found

[██████████████████████████░░░░░░░░░░] 68% 
●●●●✨●.●.●●.●.●.●●●✨●●.●.●●
```

### **Results Display**
```
┌────┬─────────────────┬────────────┬────────────────────────────────────────┐
│ #  │ IP Address      │ Status     │ Open Ports                             │
├────┼─────────────────┼────────────┼────────────────────────────────────────┤
│ 1  │ 192.168.1.1     │ 🟢 ONLINE  │ 🌍 80 🔒 443 🔐 22                     │
│ 2  │ 192.168.1.105   │ 🟢 ONLINE  │ 🐍 5000 🌍 80                          │
│ 3  │ 192.168.1.110   │ 🟢 ONLINE  │ 📁 21 🔐 22                            │
└────┴─────────────────┴────────────┴────────────────────────────────────────┘
```

---

## 🚀 **Quick Start**

### **Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/hypescan.git
cd hypescan

# Install dependencies
npm install

# Make it executable
chmod +x scanner.js
```

### **Basic Usage**

```bash
# Show help
node scanner.js --help

# Scan a network with visual feedback
node scanner.js scan --network 192.168.1.0/24 --ports

# Scan cafe/coffeeshop network
node scanner.js cafe

# Find Flask development servers
node scanner.js find-flask

# Deep scan specific IP
node scanner.js deepscan 192.168.1.105
```

### **As Global Command**
```bash
# Install globally
npm install -g .

# Now use from anywhere
hypescan scan --network 10.0.0.0/24
hypescan interfaces
```

---

## 📖 **Command Reference**

| Command | Description | Example |
|---------|-------------|---------|
| `scan` | Scan a network with options | `hypescan scan -n 192.168.1.0/24 -p` |
| `cafe` | Cafe mode: detect developers | `hypescan cafe` |
| `find-flask` | Hunt for Flask servers | `hypescan find-flask` |
| `find-devs` | Find developer machines | `hypescan find-devs` |
| `deepscan` | Deep scan specific IP | `hypescan deepscan 192.168.1.105` |
| `interfaces` | Show network interfaces | `hypescan interfaces` |
| `portscan` | Scan ports on IP | `hypescan portscan 192.168.1.1 80,443` |

### **Scan Options**
- `-n, --network` : Network CIDR (default: auto-detect)
- `-c, --concurrency` : Threads 1-254 (default: 50)
- `-t, --timeout` : Timeout per IP in ms (default: 1500)
- `-p, --ports` : Enable port scanning

---

## 🏪 **Cafe/Co-Working Mode**

HypeScan's special **Cafe Mode** is perfect for:
- **Finding developers** in co-working spaces
- **Detecting Flask/Django** development servers
- **Identifying database** and web servers
- **Network security** assessment

```bash
# Enter cafe mode
hypescan cafe

# Output includes:
# • Device types (Developer, Database, Web Server)
# • Developer stacks (Python, JavaScript, Java)
# • Service detection
# • Security risk assessment
```

---

## 🛠️ **Technical Details**

### **Architecture**
- **Pure Node.js** - No native dependencies required
- **TCP Socket-based** - Works without ICMP permissions
- **Async Parallel Processing** - Maximizes scanning speed
- **Modular Design** - Easy to extend and customize

### **Dependencies**
- `chalk` - Terminal styling and colors
- `cli-table` - Beautiful table outputs
- `ip` - IP address manipulation
- `async` - Parallel processing control
- `commander` - CLI argument parsing

### **Performance**
- **~10 seconds** for full /24 network scan
- **Concurrent scanning** minimizes wait time
- **Smart timeout** handling for efficiency
- **Memory efficient** batch processing

---

## 🔧 **Development**

### **Project Structure**
```
hypescan/
├── scanner.js          # Main scanner implementation
├── package.json        # Dependencies and scripts
├── README.md           # This file
└── examples/           # Example scripts
```

### **Extending HypeScan**
```javascript
// Create custom scanner
const { HypeScan } = require('./scanner.js');

class MyScanner extends HypeScan {
    async customScan(ip) {
        // Add your custom logic here
        const result = await this.smartPing(ip);
        return this.enhanceResult(result);
    }
}
```

---

## ⚖️ **Ethical Use & Disclaimer**

### **Important Guidelines**
```bash
⚖️  ETHICAL GUIDELINES FOR HYPERSCAN:

1. ⚠️  ONLY SCAN NETWORKS YOU OWN OR HAVE PERMISSION
2. 🔒 Do not attempt to access devices without authorization
3. 📝 This tool is for NETWORK DISCOVERY only
4. 🚫 Do not use for malicious purposes
5. 📚 Use for learning and security research only

By using HypeScan, you agree to use it responsibly.
```

### **Legal**
- HypeScan is for **educational and authorized testing** only
- Always obtain **written permission** before scanning networks
- Respect privacy and **follow applicable laws**

---

## 🤝 **Contributing**

We love contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### **Areas for Contribution**
- New detection modules
- Performance improvements
- Additional output formats
- GUI/web interface
- Documentation and examples

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 HypeScan Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🌟 **Why HypeScan?**

| Feature | HypeScan | Traditional Scanners |
|---------|----------|---------------------|
| **Visual Feedback** | ✅ Live progress, colors, emojis | ❌ Plain text |
| **Ease of Use** | ✅ Simple commands, auto-detection | ❌ Complex flags |
| **Speed** | ✅ Parallel processing, smart timeouts | ⚠️ Varies |
| **Portability** | ✅ Pure Node.js, no root needed | ❌ Often needs root |
| **Reporting** | ✅ Beautiful tables, JSON export | ⚠️ Basic output |

---

## 🚨 **Troubleshooting**

### **Common Issues**

```bash
# If "command not found"
chmod +x scanner.js
npm link

# If dependencies fail
rm -rf node_modules package-lock.json
npm install

# If timeout errors
hypescan scan -t 3000  # Increase timeout
```

### **Performance Tips**
- Use `-c 100` for faster scanning on good connections
- Use `-t 1000` for LAN networks (faster timeouts)
- Limit port scanning with specific ports when needed

---

## 📚 **Learning Resources**

### **Related Tools**
- [Nmap](https://nmap.org/) - Industry standard scanner
- [Masscan](https://github.com/robertdavidgraham/masscan) - Mass IP scanner
- [Netcat](https://nmap.org/ncat/) - Network utility

### **Networking Concepts**
- [TCP/IP Basics](https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/)
- [Port Scanning Techniques](https://nmap.org/book/man-port-scanning-techniques.html)
- [Network Security](https://owasp.org/www-project-top-ten/)

---

<div align="center">

## **Ready to Scan?**

```bash
# Start your network exploration journey
git clone https://github.com/yourusername/hypescan.git
cd hypescan
npm install
node scanner.js --help
```

**⭐ Star this repo if you find it useful!**

[![Twitter Follow](https://img.shields.io/twitter/follow/yourhandle?style=social)](https://twitter.com/yourhandle)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/hypescan)](https://github.com/yourusername/hypescan/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/hypescan/pulls)

**Made with ❤️ and ⚡ by the HypeScan Community**

</div>

---

## 🔗 **Connect**
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
- **Website**: [hypescan.dev](https://hypescan.dev) *(example)*
- **Discord**: [Join our community](https://discord.gg/yourinvite) *(example)*

**Happy Scanning! 🚀**
