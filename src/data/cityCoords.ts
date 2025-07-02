export const cityCoords: Record<string, { name: string; coordinates: [number, number] }> = {
  // 亚洲
  'Asia/Shanghai':        { name: '上海',     coordinates: [121.4737, 31.2304] },
  'Asia/Beijing':         { name: '北京',     coordinates: [116.4074, 39.9042] },
  'Asia/Chongqing':       { name: '重庆',     coordinates: [106.5516, 29.5630] },
  'Asia/Harbin':          { name: '哈尔滨',   coordinates: [126.6424, 45.7560] },
  'Asia/Urumqi':          { name: '乌鲁木齐', coordinates: [87.6168, 43.8256] },
  'Asia/Taipei':          { name: '台北',     coordinates: [121.5654, 25.0330] },
  'Asia/Hong_Kong':       { name: '香港',     coordinates: [114.1694, 22.3193] },
  'Asia/Tokyo':           { name: '东京',     coordinates: [139.6917, 35.6895] },
  'Asia/Seoul':           { name: '首尔',     coordinates: [126.9780, 37.5665] },
  'Asia/Singapore':       { name: '新加坡',   coordinates: [103.8198, 1.3521] },
  'Asia/Kuala_Lumpur':    { name: '吉隆坡',   coordinates: [101.6869, 3.1390] },
  'Asia/Bangkok':         { name: '曼谷',     coordinates: [100.5018, 13.7563] },
  'Asia/Kolkata':         { name: '孟买',     coordinates: [72.8777, 19.0760] },
  'Asia/Dubai':           { name: '迪拜',     coordinates: [55.2708, 25.2048] },

  // 欧洲
  'Europe/London':        { name: '伦敦',     coordinates: [-0.1276, 51.5074] },
  'Europe/Paris':         { name: '巴黎',     coordinates: [2.3522, 48.8566] },
  'Europe/Berlin':        { name: '柏林',     coordinates: [13.4050, 52.5200] },
  'Europe/Moscow':        { name: '莫斯科',   coordinates: [37.6173, 55.7558] },
  'Europe/Rome':          { name: '罗马',     coordinates: [12.4964, 41.9028] },
  'Europe/Madrid':        { name: '马德里',   coordinates: [-3.7038, 40.4168] },
  'Europe/Amsterdam':     { name: '阿姆斯特丹', coordinates: [4.9041, 52.3676] },
  'Europe/Tallinn':     { name: '马尔杜', coordinates: [25.0250, 59.4767] },

  // 美洲
  'America/New_York':     { name: '纽约',     coordinates: [-74.0060, 40.7128] },
  'America/Chicago':      { name: '芝加哥',   coordinates: [-87.6298, 41.8781] },
  'America/Denver':       { name: '丹佛',     coordinates: [-104.9903, 39.7392] },
  'America/Los_Angeles':  { name: '洛杉矶',   coordinates: [-118.2437, 34.0522] },
  'America/Vancouver':    { name: '温哥华',   coordinates: [-123.1207, 49.2827] },
  'America/Toronto':      { name: '多伦多',   coordinates: [-79.3832, 43.6532] },
  'America/Sao_Paulo':    { name: '圣保罗',   coordinates: [-46.6333, -23.5505] },

  // 非洲
  'Africa/Cairo':         { name: '开罗',     coordinates: [31.2357, 30.0444] },
  'Africa/Johannesburg':  { name: '约翰内斯堡', coordinates: [28.0473, -26.2041] },
  'Africa/Tripoli':  { name: '利比亚', coordinates: [32.8872, 13.1914] },

  // 大洋洲
  'Australia/Sydney':     { name: '悉尼',     coordinates: [151.2093, -33.8688] },
  'Australia/Melbourne':  { name: '墨尔本',   coordinates: [144.9631, -37.8136] },
  'Pacific/Auckland':     { name: '奥克兰',   coordinates: [174.7633, -36.8485] }
};
