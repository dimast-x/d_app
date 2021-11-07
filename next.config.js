/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    BINANCE: process.env.BINANCE,
    ROPSTEN: process.env.ROPSTEN,
    BINANCE_CONTR: process.env.BINANCE_CONTR,
    ROPSTEN_CONTR: process.env.ROPSTEN_CONTR,
  },
}
