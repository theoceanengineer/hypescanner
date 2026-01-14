# **HypeScanner - ⚡ Hyper-Fast Network Intelligence Scanner**

<div align="center">

![HypeScanner Banner](https://img.shields.io/badge/HypeScanner-Network_Scanner-FF6B6B?style=for-the-badge&logo=terminal&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![GitHub Release](https://img.shields.io/github/v/release/theoceanengineer/hypescanner?style=for-the-badge)

**Discover, Scan, and Analyze Networks with Stunning Visual Feedback**

[![GitHub stars](https://img.shields.io/github/stars/theoceanengineer/hypescanner?style=social)](https://github.com/theoceanengineer/hypescanner/stargazers)
[![Downloads](https://img.shields.io/npm/dt/hypescanner?color=blue&style=flat-square)](https://npmjs.com/package/hypescanner)
[![GitHub issues](https://img.shields.io/github/issues/theoceanengineer/hypescanner?style=flat-square)](https://github.com/theoceanengineer/hypescanner/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/theoceanengineer/hypescanner?style=flat-square)](https://github.com/theoceanengineer/hypescanner/commits/main)

</div>

---

## 🌊 **Welcome to HypeScanner by @theoceanengineer**

**HypeScanner** is a powerful, visually stunning network scanner built with Node.js that transforms the boring task of network scanning into an engaging, informative experience. Created by **@theoceanengineer**, this tool combines professional-grade scanning capabilities with beautiful terminal visuals.

---

## 🚀 **Quick Start**

### **Installation**

```bash
# Clone the repository
git clone https://github.com/theoceanengineer/hypescanner.git
cd hypescanner

# Install dependencies
npm install

# Make it executable
chmod +x scanner.js

# Run your first scan
node scanner.js scan --network 192.168.1.0/24
```

---

## ✨ **Why Choose HypeScanner?**

| Feature | HypeScanner 🔥 | Traditional Scanners 😴 |
|---------|---------------|------------------------|
| **Visual Interface** | ✅ Live progress, emojis, colors | ❌ Plain text output |
| **Ease of Use** | ✅ Auto-detection, simple commands | ❌ Complex configuration |
| **Performance** | ✅ 254 concurrent threads | ⚠️ Limited concurrency |
| **Portability** | ✅ Pure Node.js, no root needed | ❌ Often requires root |
| **Developer Focus** | ✅ Cafe mode, Flask detection | ❌ Generic scanning only |
| **Reporting** | ✅ Beautiful tables + JSON export | ⚠️ Basic text output |

---

## 📋 **Command Reference**

### **Basic Scanning**
```bash
# Scan with visual feedback
hypescanner scan --network 192.168.68.0/24 --ports

# Auto-detect network and scan
hypescanner scan

# High-speed scanning (100 threads)
hypescanner scan -c 100 -t 1000
```

### **Advanced Features**
```bash
# Cafe/Co-working space analysis
hypescanner cafe

# Hunt for Flask development servers
hypescanner find-flask

# Find all developer machines
hypescanner find-devs

# Deep scan specific device
hypescanner deepscan 192.168.68.109
```

### **Utility Commands**
```bash
# Show network interfaces
hypescanner interfaces

# Port scan specific IP
hypescanner portscan 192.168.1.1 80,443,8080

# Scan port range
hypescanner portscan 192.168.1.1 20-30
```

---

## 🏪 **Cafe Mode - Perfect for Developers**

HypeScanner's **Cafe Mode** is specially designed for:
- **Developer detection** in co-working spaces
- **Flask/Django** server identification
- **Service discovery** (MySQL, Redis, MongoDB)
- **Network security** assessment

**Example Output:**
```
╔══════════════════════════════════════╗
║      ☕ CAFE NETWORK SCANNER         ║
╚══════════════════════════════════════╝

📍 Detected network: 192.168.68.0/24
🔍 Scanning for active devices...

🎯 Found 8 active hosts

🔬 Profiling detected devices...

  1. 192.168.68.105 🔸 Development Machine
     👨‍💻 Python Developer
     🛠️  Web:5000, Web:80

  2. 192.168.68.110 ⚠️  Database Server
     🛠️  MySQL:3306

📊 Statistics:
   Total devices: 8
   Developer machines: 1
   Database servers: 1

👨‍💻 Developer Activity Detected:
   🐍 Python Developer: 1 device(s)

🎯 Potential Flask Development:
   • 192.168.68.105
```

---

## 🛠️ **Technical Specifications**

### **Architecture**
- **Pure JavaScript** - No native dependencies
- **TCP Socket-based** - Works without ICMP permissions
- **Async Parallel Processing** - Maximizes efficiency
- **Modular Design** - Easy to extend

### **Performance Metrics**
- **10-15 seconds** for full /24 network scan
- **Up to 254 concurrent** connections
- **Smart timeout handling** (configurable)
- **Memory-efficient** batch processing

### **Dependencies**
```json
{
  "chalk": "^4.1.2",      // Terminal colors
  "cli-table": "^0.3.11", // Beautiful tables
  "ip": "^2.0.0",        // IP manipulation
  "async": "^3.2.4",     // Parallel processing
  "commander": "^9.4.1"  // CLI parsing
}
```

---

## 📊 **Sample Output**

### **Live Scanning Progress**
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

📊 SCAN SUMMARY:
   Total IPs scanned: 254
   Active hosts: 19
   Inactive hosts: 235
   Success rate: 7.5%
```

---

## 🔧 **Development & Contribution**

### **Project Structure**
```
hypescanner/
├── scanner.js          # Main scanner implementation
├── package.json        # Dependencies and scripts
├── README.md           # Documentation
├── LICENSE             # MIT License
└── examples/           # Usage examples
```

### **Building from Source**
```bash
# Clone and setup
git clone https://github.com/theoceanengineer/hypescanner.git
cd hypescanner

# Install dev dependencies
npm install

# Run tests
npm test

# Create production build
npm run build
```

### **Contributing Guidelines**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Areas needing contribution:**
- Additional port detection modules
- Web interface/dashboard
- Performance optimizations
- Documentation improvements

---

## ⚖️ **Ethical Use & Legal Disclaimer**

### **Important Notice**
```bash
⚖️  ETHICAL GUIDELINES FOR HYPERSCANNER:

1. ⚠️  ONLY SCAN NETWORKS YOU OWN OR HAVE EXPLICIT PERMISSION
2. 🔒 Do not attempt unauthorized access to devices
3. 📝 This tool is for NETWORK DISCOVERY and EDUCATIONAL purposes only
4. 🚫 Never use for malicious activities
5. 📚 Respect privacy and follow all applicable laws

By using HypeScanner, you agree to use it responsibly and legally.
```

### **Legal Compliance**
- HypeScanner is for **authorized security testing** only
- Always obtain **written permission** before scanning
- Comply with **Computer Fraud and Abuse Act** and local laws
- Respect **privacy policies** and terms of service

---

## 🚨 **Troubleshooting**

### **Common Issues & Solutions**

```bash
# Issue: "Command not found"
# Solution:
chmod +x scanner.js
npm link
# Or use directly:
node scanner.js scan

# Issue: Timeout errors
# Solution: Increase timeout
hypescanner scan -t 3000

# Issue: Slow scanning
# Solution: Adjust concurrency
hypescanner scan -c 150

# Issue: Permission denied
# Solution: TCP ports don't need root, but try:
sudo node scanner.js scan
```

### **Performance Optimization**
- **LAN Networks**: Use `-t 1000` (lower timeout)
- **WAN/VPN Networks**: Use `-t 3000` (higher timeout)
- **Max Speed**: Use `-c 254` for maximum concurrency
- **Selective Ports**: Only scan necessary ports with `--ports`

---

## 📚 **Learning Resources**

### **Related Projects by @theoceanengineer**
- [Network Toolkit](https://github.com/theoceanengineer/network-toolkit) - Additional networking tools
- [Security Scripts](https://github.com/theoceanengineer/security-scripts) - Security-related utilities

### **Recommended Reading**
- [Nmap Network Scanning](https://nmap.org/book/) - The official guide
- [TCP/IP Illustrated](https://en.wikipedia.org/wiki/TCP/IP_Illustrated) - Networking fundamentals
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) - Security testing

---

## 📄 **License**

**MIT License**

Copyright (c) 2024 Theoceanengineer (GitHub: @theoceanengineer)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🌐 **Connect & Support**

<div align="center">

### **Created with ❤️ by @theoceanengineer**

[![GitHub Follow](https://img.shields.io/github/followers/theoceanengineer?style=social&label=Follow%20@theoceanengineer)](https://github.com/theoceanengineer)
[![Twitter Follow](https://img.shields.io/twitter/follow/theoceaneng?style=social)](https://twitter.com/theoceaneng)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20-green?style=for-the-badge&logo=buymeacoffee)](https://buymeacoffee.com/theoceanengineer)

**⭐ Star this repo if you find it useful!**  
**🐛 Report issues on GitHub**  
**🔄 Submit pull requests to improve**

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/theoceanengineer/hypescanner)
[![NPM Package](https://img.shields.io/badge/NPM-Package-red?style=for-the-badge&logo=npm)](https://npmjs.com/package/hypescanner)

**Happy Scanning! ⚡🔍**

</div>

---

## 🎯 **Use Cases**

### **For Developers**
- Test your Flask/Django apps on different ports
- Find available IPs in development networks
- Monitor local network activity
- Debug network connectivity issues

### **For Network Admins**
- Quick network inventory
- Detect unauthorized devices
- Service discovery and mapping
- Security assessment

### **For Security Researchers**
- Port scanning for vulnerability assessment
- Network reconnaissance
- Service identification
- Security auditing

### **For Students & Learners**
- Learn networking concepts hands-on
- Understand port scanning techniques
- Practice ethical hacking skills
- Network analysis and documentation

---

## 📈 **Roadmap**

### **Planned Features**
- [ ] **Web Dashboard** - Browser-based interface
- [ ] **API Mode** - JSON/REST API for integration
- [ ] **More Protocols** - UDP, ICMP scanning
- [ ] **OS Detection** - Operating system fingerprinting
- [ ] **Vulnerability Checks** - Basic CVE detection
- [ ] **Network Mapping** - Visual topology generation
- [ ] **Export Formats** - CSV, XML, PDF reports
- [ ] **Mobile App** - Companion app for iOS/Android

### **Current Version: v2.0.0**
- ✅ TCP-based scanning
- ✅ Visual feedback system
- ✅ Cafe/developer mode
- ✅ Multi-network scanning
- ✅ JSON export capability
- ✅ No root permissions needed

---

**Thank you for checking out HypeScanner! Your feedback and contributions make this project better every day.** 🚀
