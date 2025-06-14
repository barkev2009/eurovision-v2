const axios = require("axios");
const fs = require("fs");
const path = require("path");
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: path.resolve(__dirname, '.env.development') });
} else {
    require('dotenv').config({ path: path.resolve(__dirname, '.env.production') });
}

const restoreStatic = async () => {
    console.log('RESTORING STATIC');
    try {
        const countries = await axios.get(process.env.SERVER_URL + '/api/country');
        for (const country of countries.data) {
            console.log();
            const { icon, name, code } = country;
            console.log(name, code);
            if (!fs.readdirSync('static').includes(icon)) {
                const link = `https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${code}.svg`;
                console.log(link);
                try {
                    const response = await axios.get(link, { responseType: 'stream' });
                    const file = fs.createWriteStream('./static/' + icon);
                    response.data.pipe(file);
                    file.on('finish', () => {
                        console.warn(`FILE CREATED: ${icon}`);
                        file.close();
                    });
                } catch (err) {
                    console.error(err.response.status);
                    console.error(err.response.config.url);
                }
            }
        }
    } catch (err) {
        console.error(err)
    } finally {
        return
    }
}

restoreStatic();