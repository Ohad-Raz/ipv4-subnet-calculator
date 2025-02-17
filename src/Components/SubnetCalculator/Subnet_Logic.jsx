export const validateIP = (ip) => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/; // Basic IPv4 regex validation
  if (!ipRegex.test(ip)) return false;

  const octets = ip.split('.').map(Number);
  return octets.every((octet) => octet >= 0 && octet <= 255);
};

export const calculateRequiredSubnetMask = (devices) => {
  const totalHosts = parseInt(devices); // Do not add 2 for network and broadcast when allowing full range
  const hostBits = Math.ceil(Math.log2(totalHosts)); // Calculate required host bits
  const subnetMask = 32 - hostBits;

  if (subnetMask < 0) {
    return 0; // If devices exceed IPv4 limit, return /0
  }

  return subnetMask;
};

export const calculateNetworkAddress = (ip, mask) => {
  if (mask === 0) return '0.0.0.0'; // Special case for /0
  const ipBinary = ipToBinary(ip);
  const maskBinary = getSubnetMaskBinary(mask);
  const networkBinary = ipBinary.map((bit, i) => bit & maskBinary[i]);
  return binaryToIp(networkBinary);
};

export const calculateBroadcastAddress = (network, mask) => {
  if (mask === 0) return '255.255.255.255'; // Special case for /0
  const maskBinary = getSubnetMaskBinary(mask).map((bit) => (bit === 1 ? 0 : 1));
  const networkBinary = ipToBinary(network);
  const broadcastBinary = networkBinary.map((bit, i) => bit | maskBinary[i]);
  return binaryToIp(broadcastBinary);
};

export const calculateFirstUsableIp = (network, mask) => {
  if (mask === 0) return '0.0.0.1'; // Special case for /0
  const ipBinary = ipToBinary(network);
  const ipDecimal = binaryToDecimal(ipBinary);
  return decimalToIp(ipDecimal + 1);
};

export const calculateLastUsableIp = (broadcast, mask) => {
  if (mask === 0) return '255.255.255.254'; // Special case for /0
  const ipBinary = ipToBinary(broadcast);
  const ipDecimal = binaryToDecimal(ipBinary);
  return decimalToIp(ipDecimal - 1);
};

export const prefixToDecimal = (prefix) => {
  const maskBinary = Array(32)
    .fill(0)
    .fill(1, 0, prefix) // Fill '1's for the network bits
    .join('');
  return maskBinary
    .match(/.{8}/g) // Split into 8-bit octets
    .map((octet) => parseInt(octet, 2)) // Convert binary octets to decimal
    .join('.'); // Join into the standard decimal format
};

// Helper functions
const ipToBinary = (ip) =>
  ip
    .split('.')
    .map((octet) => Number(octet).toString(2).padStart(8, '0'))
    .join('')
    .split('')
    .map(Number);

const binaryToIp = (binary) =>
  binary
    .join('')
    .match(/.{8}/g)
    .map((octet) => parseInt(octet, 2))
    .join('.');

const binaryToDecimal = (binary) => parseInt(binary.join(''), 2);

const decimalToIp = (decimal) => {
  const octets = [];
  for (let i = 0; i < 4; i++) {
    octets.unshift(decimal & 255);
    decimal >>= 8;
  }
  return octets.join('.');
};

const getSubnetMaskBinary = (mask) => Array(32).fill(0).fill(1, 0, mask);

export const getClassDefaultIP = (ipClass) => {
  switch (ipClass) {
    case 'A': return '10.0.0.0';
    case 'B': return '172.16.0.0';
    case 'C': return '192.168.0.0';
    default: return '0.0.0.0';
  }
};
