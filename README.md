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

## Authors

* **Austin Gordon** - *Development* - [GitHub](https://github.com/AustinLeeGordon)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgements

* **Kennedy Rose** - *Developed Plugin* - [GitHub](https://github.com/kennedyrose)