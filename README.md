# Gatsby Source MachineFinder

Gatsby source plugin for using [MachineFinder](https://www.machinefinder.com/) as a data source.

## Installing

`npm install --save gatsby-source-machinefinder`

## How to use

```js
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-machinefinder`,
    options: {
        key: 'YOUR MACHINEFINDER KEY',
        password: 'YOUR MACHINEFINDER PASSWORD',
        url: 'URL TO YOUR MACHINEFINDER XML FEED'
    },
  },
]
```

## License

MIT © [Hutson Inc](https://www.hutsoninc.com)

## Acknowledgements

* **Kennedy Rose** - *Developed Original Plugin* - [GitHub](https://github.com/kennedyrose)