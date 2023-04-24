require('dotenv').config();
const path = require('path');
const { FIRST_SEMIFINAL } = require('../models/enum');
const { Rating } = require('../models/models');
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
) => {


    const country = await createCountry(countryName);
    let contestant;
    let entry;
    let rating;

    const contestantCheck = await Contestant.findAll({ where: { artist_name, song_name, year } });
    if (contestantCheck.length !== 0) {
        console.log('Contestant found');
        contestant = contestantCheck[0];
    } else {
        contestant = await Contestant.create({ artist_name, song_name, year, countryId: country.countryId });
        console.log('Contestant created');
    }

    const entryCheck = await Entry.findAll({ where: { entry_order, contest_step, contestantId: contestant.id } });
    if (entryCheck.length !== 0) {
        console.log('Entry found');
        entry = entryCheck[0];
    } else {
        entry = await Entry.create({ entry_order, contest_step, contestantId: contestant.id });
        console.log('Entry created');
    }

    const ratingCheck = await Rating.findAll({ where: { userId: '877d4152-14b4-7793-e143-1025604c2b34', entryId: entry.id } });
    if (ratingCheck.length !== 0) {
        console.log('Rating found');
        rating = ratingCheck[0];
    } else {
        rating = await Rating.create(
            {
                userId: '877d4152-14b4-7793-e143-1025604c2b34',
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


    console.log(country.countryId);
    console.log(contestant.id);
    console.log(entry.id);
    console.log(rating.id);
    return true;
}

const test = async () => {

    fs.createReadStream(path.resolve(__dirname, 'entries_2023.csv'))
        .pipe(csv())
        .on('data', async (data) => {
            try {
                console.log(`|${data.COUNTRY.trim()}|`);
                await createContestantRating(
                    data.COUNTRY.trim(),
                    data.ARTIST.trim(),
                    data.SONG.trim(),
                    Number(data.YEAR.trim()),
                    Number(data.ORDER.trim()),
                    data.CONTEST_STEP.trim()
                );
                //perform the operation
            }
            catch (err) {
                //error handler
            }
        })
        .on('end', function () {
            //some final operation
        });
}

test();