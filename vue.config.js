module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  ublicPath: process.env.NODE_ENV === 'production'
    ? '/connect4'
    : '/'
}
