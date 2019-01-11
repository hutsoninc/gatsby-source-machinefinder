const fetch = require('fetch-retry');
const crypto = require('crypto');
const xml2js = require('xml2js');

async function fetchData(options) {
    let data = await fetch(options.url, {
        method: 'POST',
        body: `key=${options.key}&password=${options.password}`,
    });
    let text = await data.text();
    let obj = await parseString(text);
    return obj;
}

function parseString(str) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(str, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

function flattenObj(obj) {
    if (!obj) return;
    for (let i in obj) {
        if (Array.isArray(obj[i]) && obj[i].length === 1) {
            obj[i] = obj[i][0];
        }
    }
    return obj;
}

exports.sourceNodes = async ({ actions }, options) => {

    const { createNode } = actions;

    console.log('Fetching MachineFinder equipment');

    let data = await fetchData(options);
    data = data.machines.machine;

    console.log('Creating MachineFinder nodes');

    data = data.forEach(machine => {
        if (typeof machine === 'object') {

            // Flatten first layer
            flattenObj(machine);

            // Flatten images
            if (machine.images && machine.images.image && machine.images.image.length) {
                let images = [];
                machine.images.image.forEach(img => {
                    if (img.filePointer && img.filePointer.length) {
                        if (img.filePointer[0].indexOf('http:') != -1) {
                            images.push(
                                'https' + img.filePointer[0].slice(4)
                            );
                        } else {
                            images.push(img.filePointer[0]);
                        }
                    }
                })
                machine.images = images;
            } else {
                machine.images = [];
            }

            // Flatten options
            if (machine.options && machine.options.option && machine.options.option.length) {
                let options = [];
                machine.options.option.forEach(obj => {
                    options.push({
                        label: obj.label ? obj.label[0] : '',
                        value: obj.value ? obj.value[0] : ''
                    });
                });
                machine.options = options;
            }

            // Match dealership
            if (machine.dealerId && options.dealerships) {
                let storeObj = options.dealerships.find(obj => (obj.ids.indexOf(machine.dealerId) >= 0));
                if (storeObj) {
                    machine.location = storeObj.name;
                } else {
                    machine.location = '';
                    console.log("No dealership found for " + machine.id);
                }
            }

            // Flatten price
            flattenObj(machine.advertised_price);
            if (machine.advertised_price && machine.advertised_price.amount) {
                machine.advertised_price = Number(machine.advertised_price.amount);
            }
            if (machine.wholesale_price && machine.wholesale_price.amount) {
                machine.wholesale_price = Number(machine.advertised_price.amount);
            } else {
                machine.wholesale_price = null;
            }

            // Convert hours to numbers
            if (machine.operationHours) {
                machine.operationHours = Number(machine.operationHours);
            } else {
                machine.operationHours = null;
            }
            if (machine.separatorHours) {
                machine.separatorHours = Number(machine.separatorHours);
            } else {
                machine.separatorHours = null;
            }

            machine = Object.assign({
                parent: null,
                children: [],
                internal: {
                    type: 'MachineFinder',
                    contentDigest: crypto
                        .createHash('md5')
                        .update(JSON.stringify(machine))
                        .digest('hex'),
                    mediaType: 'application/json',
                }
            }, machine);

            createNode(machine);
        }
    });

    console.log(`Created MachineFinder nodes`);

    return;
}