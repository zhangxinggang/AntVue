const files = require.context('./services', true, /\.js$/i)
files.keys().forEach(key => {
    let value = key.replace(/\\/g, '/')
    let matched = value.match(/\/(\S*)\.js$/i)
    if (matched && matched.length > 1) {
        files(key)
    }
})