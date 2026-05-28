// src/config/whitelist.ts

// List of allowed IP addresses (add your aaPanel server IPs here or via ENV)
const envIps = process.env.WHITELISTED_IPS;
// Accept comma or semicolon separated list from ENV
const envIpList = envIps ? envIps.split(/[,;]/).map(ip => ip.trim()).filter(Boolean) : [];

export const WHITELISTED_IPS = envIpList.length > 0 ? envIpList : [
  // Example: "123.123.123.123",
];
