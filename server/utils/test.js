require('dotenv').config();
const path = require('path');
const { FIRST_SEMIFINAL } = require('../models/enum');
const { Rating, User } = require('../models/models');
const { Contestant, Entry } = require('../models/models');
const { createCountry } = require("./country");
const csv = require('csv-parser');
const fs = require('fs');

const createContestantRating = async (
    countryName
    , artist_name
    , song_name
    , year
    , entry_order
    , contest_step
    , place
) => {


    const country = await createCountry(countryName);
    let contestant;
    let entry;
    let rating;

    const contestantCheck = await Contestant.findOne({ where: { artist_name, song_name, year } });
    console.log(contestantCheck);
    // console.log(contestantCheck.length);
    if (contestantCheck) {
        console.log('Contestant found');
        contestant = contestantCheck;
    } else {
        contestant = await Contestant.create({ artist_name, song_name, year, countryId: country.countryId });
        console.log('Contestant created');
    }

    if (Number(place) !== 0) {
        await Contestant.update(
            {
                place_in_final: Number(place)
            },
            {
                where: {
                    id: contestant.id
                }
            }
        );
    }

    const entryCheck = await Entry.findOne({ where: { entry_order, contest_step, contestantId: contestant.id } });
    console.log(entryCheck);
    // console.log(entryCheck.length);
    if (entryCheck) {
        console.log('Entry found');
        entry = entryCheck;
    } else {
        entry = await Entry.create({ entry_order, contest_step, contestantId: contestant.id });
        console.log('Entry created');
    }

    const users = await User.findAll();

    let user;
    let ratingCheck
    for (let i = 0; i < users.length; i++) {
        user = users[i];
        ratingCheck = await Rating.findOne({ where: { userId: user.id, entryId: entry.id } });
        console.log(ratingCheck);
        // console.log(ratingCheck.length);
        if (ratingCheck) {
            console.log('Rating found');
            rating = ratingCheck;
        } else {
            rating = await Rating.create(
                {
                    userId: user.id,
                    entryId: entry.id,
                    purity: 0,
                    show: 0,
                    difficulty: 0,
                    originality: 0,
                    sympathy: 0,
                    score: 0
                }
            );
            console.log('Rating created');
        }
    }


    console.log(country.countryId);
    console.log(contestant.id);
    console.log(entry.id);
    console.log(rating.id);
}

const test = async (fileName) => {

    let allData = [];

    fs.createReadStream(path.resolve(__dirname, 'db_files/csv', fileName + '.csv'))
        .pipe(csv())
        .on('data', async (data) => {
            try {
                // console.log(`|${data.COUNTRY.trim()}|`);
                // console.log('SOMETHING_ELSE');
                allData.push(data);
                //perform the operation
            }
            catch (err) {
                //error handler
            }
        })
        .on('end', function () {
            //some final operation
            // console.log(allData);
            const body = JSON.stringify(allData);
            var localPath = path.resolve(__dirname, 'db_files/json', fileName + '.json');
            fs.writeFile(localPath, body, function (err) { });
        });
}

const test2 = async (fileName) => {


    const allData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db_files/json', fileName + '.json'), 'utf8'));
    console.log(allData);

    let data;
    for (let i = 0; i < allData.length; i++) {
        data = allData[i];
        if (data.COUNTRY) {
            await createContestantRating(
                data.COUNTRY.trim(),
                data.ARTIST.trim(),
                data.SONG.trim(),
                Number(data.YEAR.trim()),
                Number(data.ORDER.trim()),
                data.CONTEST_STEP.trim(),
                Number(data.PLACE.trim())
            );
        }
    }
};

test2('entries_2023');