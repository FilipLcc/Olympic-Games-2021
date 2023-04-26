import express, { json } from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import e from 'express';
import user from './model/user';
import nation from './model/nation';
import request from './model/request';
import sport from './model/sport';
import discipline from './model/discipline';
import athlete from './model/athlete';
import venue from './model/venue';
import format from './model/format';
import competition from './model/competition';
import schedule from './model/schedule';

//objectID
import { ObjectID } from 'bson';
var ObjectId = require('mongodb').ObjectID;

const app = express();



app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/Olimpijada_2021");

const conn = mongoose.connection;

conn.once("open", () => {
    console.log("MongoDB is open");
});

const router = express.Router();


router.route("/login").post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    user.findOne({ "username": username, "password": password }, (err, foundUser) => {
        if (err)
            console.log(err);
        else {
            if (foundUser) {
                res.json(foundUser);
            }
            else {
                //should never happen
            }
        }
    });
});

router.route("/checkLoginData").post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    user.findOne({ "username": username, "password": password }, (err, foundUser) => {
        if (err)
            console.log(err);
        else {
            if (foundUser) {
                res.json({ "message": "ok" });
            }
            else {
                res.json({ "message": "not_ok" });
            }
        }
    });
});

router.route("/allNations").post((req, res) => {
    nation.find({}, (err, foundNations) => {
        if (err)
            console.log(err);
        else {
            res.json(foundNations);
        }
    });
});


router.route("/allSports").post((req, res) => {
    sport.find({}, (err, foundSports) => {
        if (err)
            console.log(err);
        else {
            res.json(foundSports);
        }
    });
});


router.route("/allDisciplines").post((req, res) => {
    discipline.find({}, (err, foundDiscs) => {
        if (err)
            console.log(err);
        else {
            res.json(foundDiscs);
        }
    });
});

router.route("/allVenues").post((req, res) => {
    venue.find({}, (err, foundVenues) => {
        if (err)
            console.log(err);
        else {
            res.json(foundVenues);
        }
    });
});

router.route("/allFormats").post((req, res) => {
    format.find({}, (err, foundFormats) => {
        if (err)
            console.log(err);
        else
            res.json(foundFormats);
    })
});

router.route("/comparePasswords").post((req, res) => {
    let entered_new_pass = req.body.new_pass;
    let entered_old_pass = req.body.old_pass;
    let username = req.body.username;

    user.findOne({ "username": username }, (err, foundUser) => {
        if (err)
            console.log(err);
        else {
            if (!foundUser) {
                res.json({ "message": "A user with your username is not found. You will be signed out." });
                return;
            }
            else {
                let whitespaces = /^\s+$/;

                if (entered_new_pass == "" || entered_old_pass == "" || whitespaces.test(entered_old_pass) || whitespaces.test(entered_new_pass)) {
                    res.json({ "message": "You must fill all the fields.\n" });
                    return;
                }
                if (entered_new_pass.split(" ").length > 1 || entered_old_pass.split(" ").length > 1) {
                    res.json({ "message": "There cannot be more than one word in a password.\n" });
                    return;
                }
                if (entered_new_pass == entered_old_pass) {
                    res.json({ "message": "New password cannot be the same as the old one.\n" });
                    return;
                }
                if (entered_new_pass.length < 8 || entered_new_pass.length > 12) {
                    res.json({ "message": "Password must contain between 8 and 12 characters.\n" });
                    return;
                }
                let cntUpper = 0;
                let cntLower = 0;
                let cntDigit = 0;
                let cntSpecial = 0;
                let triple = {
                    first: "",
                    second: "",
                    third: "",
                    fourth: ""
                }
                for (let i = 0; i < entered_new_pass.length; i++) {
                    if (/[A-Z]/.test(entered_new_pass.charAt(i)))
                        cntUpper++;
                    if (/[a-z]/.test(entered_new_pass.charAt(i)))
                        cntLower++;
                    if (/\d/.test(entered_new_pass.charAt(i))) {
                        cntDigit++;
                        //console.log(this.entered_new_pass.charAt(i));
                    }
                    if (!/[A-Z]/.test(entered_new_pass.charAt(i)) &&
                        !/[a-z]/.test(entered_new_pass.charAt(i)) &&
                        !/\d/.test(entered_new_pass.charAt(i))) {
                        cntSpecial++;
                        //console.log(this.entered_new_pass.charAt(i));
                    }
                }
                if (cntUpper < 1 || cntLower < 3 || cntDigit < 2 || cntSpecial < 2) {
                    res.json({
                        "message": "Password must contain at least one uppercase letter, at least three lowercase letters, at least 2 digits " +
                            "and at least 2 special characters.\n"
                    });
                    return;
                }

                for (let i = 0; i < entered_new_pass.length; i++) {
                    triple.first = entered_new_pass.charAt(i);
                    if (i + 1 < entered_new_pass.length)
                        triple.second = entered_new_pass.charAt(i + 1);
                    else
                        triple.second = "";
                    if (i + 2 < entered_new_pass.length)
                        triple.third = entered_new_pass.charAt(i + 2);
                    else
                        triple.third = "";
                    if (i + 3 < entered_new_pass.length)
                        triple.fourth = entered_new_pass.charAt(i + 3)
                    else
                        triple.fourth = "";

                    //console.log((triple));
                    if ((triple.first == triple.second) && (triple.second == triple.third) && (triple.third == triple.fourth)) {
                        res.json({ "message": "Password can only have a maximum three of the same consecutive characters." });
                        return;
                    }
                }

                if (!/[A-Z]/.test(entered_new_pass.charAt(0)) &&
                    !/[a-z]/.test(entered_new_pass.charAt(0))) {
                    res.json({ "message": "Password must begin with a letter." });
                    return;
                }

                //all good
                user.collection.updateOne({"username":username}, {$set:{"password":entered_new_pass}});
                res.json({ "message": "ok" });

            }
        }

    });
});



router.route("/checkRegistrationData").post((req, res) => {
    //register data
    let entered_password = req.body.entered_password;
    let password_check = req.body.password_check;
    let entered_username = req.body.entered_username;
    let entered_name = req.body.entered_name;
    let entered_surname = req.body.entered_surname;
    let entered_email = req.body.entered_email;
    let chosen_type = req.body.chosen_type;
    let chosen_nation = req.body.chosen_nation;
    //help data
    let whitespaces = /^\s+$/;
    let let_num_und_dash = /^[A-Za-z0-9_-]+$/;
    let personal = /[A-Z][a-z]*/;
    let mail_regex = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');
    //check
    if (whitespaces.test(entered_password) || whitespaces.test(password_check) || entered_password == "" || password_check == "") {
        res.json({ "message": "You must fill all the fields.\n" });
        return;
    }
    if (chosen_type == "") {
        res.json({ "message": "You must fill all the fields.\n" });
        return;
    }
    if (entered_password != password_check) {
        res.json({ "message": "Repeated password must match the original password.\n" });
        return;
    }
    if (entered_password.length < 8 || entered_password.length > 12) {
        res.json({ "message": "Password must contain between 8 and 12 characters.\n" });
        return;
    }

    let cntUpper = 0;
    let cntLower = 0;
    let cntDigit = 0;
    let cntSpecial = 0;
    let triple = {
        first: "",
        second: "",
        third: "",
        fourth: ""
    }


    for (let i = 0; i < entered_password.length; i++) {
        if (/[A-Z]/.test(entered_password.charAt(i)))
            cntUpper++;
        if (/[a-z]/.test(entered_password.charAt(i)))
            cntLower++;
        if (/\d/.test(entered_password.charAt(i))) {
            cntDigit++;
            console.log(entered_password.charAt(i));
        }
        if (!/[A-Z]/.test(entered_password.charAt(i)) &&
            !/[a-z]/.test(entered_password.charAt(i)) &&
            !/\d/.test(entered_password.charAt(i))) {
            cntSpecial++;
            console.log(entered_password.charAt(i));
        }
    }

    if (cntUpper < 1 || cntLower < 3 || cntDigit < 2 || cntSpecial < 2) {
        res.json({
            "message": "Password must contain at least one uppercase letter, at least three lowercase letters, at least 2 digits " +
                "and at least 2 special characters.\n"
        });
        return;
    }


    for (let i = 0; i < entered_password.length; i++) {
        triple.first = entered_password.charAt(i);
        if (i + 1 < entered_password.length)
            triple.second = entered_password.charAt(i + 1);
        else
            triple.second = "";
        if (i + 2 < entered_password.length)
            triple.third = entered_password.charAt(i + 2);
        else
            triple.third = "";
        if (i + 3 < entered_password.length)
            triple.fourth = entered_password.charAt(i + 3)
        else
            triple.fourth = "";

        //console.log((triple));
        if ((triple.first == triple.second) && (triple.second == triple.third) && (triple.third == triple.fourth)) {
            res.json({ "message": "Password can only have a maximum three of the same consecutive characters." });
            return
        }
    }


    if (!/[A-Z]/.test(entered_password.charAt(0)) &&
        !/[a-z]/.test(entered_password.charAt(0))) {
        res.json(({ "message": "Password must begin with a letter." }));
        return;
    }


    if (!entered_username.match(let_num_und_dash) || !entered_name.match(personal) || !entered_surname.match(personal) ||
        !entered_email.match(mail_regex)) {
        if (!entered_username.match(let_num_und_dash)) {
            if ((entered_username == "" || entered_username.match(whitespaces))) {
                res.json(({ "message": "You must fill all the fields.\n" }));
                return;
            }
            else {
                res.json(({ "message": "Username can consist only of letters, numbers, underscores and dashes.\n" }));
                return;
            }

        }
        if (!entered_name.match(personal)) {
            if ((entered_name == "" || entered_name.match(whitespaces))) {
                res.json({ "message": "You must fill all the fields.\n" });
                return;
            }
            else {
                res.json({ "message": "Name can consist only of letters, with first being capital.\n" });
                return;
            }
        }
        if (!entered_surname.match(personal)) {
            if ((entered_surname == "" || entered_surname.match(whitespaces))) {
                res.json({ "message": "You must fill all the fields.\n" });
                return;
            }
            else {
                res.json({ "message": "Surname can consist only of letters, with first being capital.\n" });
                return;
            }
        }
        if (!entered_name.match(personal)) {
            if ((entered_name == "" || entered_name.match(whitespaces))) {
                res.json({ "message": "You must fill all the fields.\n" });
                return;
            }
            else {
                res.json({ "message": "Name can consist only of letters, with first being capital.\n" });
                return;
            }

        }
        if (!entered_email.match(mail_regex)) {
            if ((entered_email == "" || entered_email.match(whitespaces))) {
                res.json({ "message": "You must fill all the fields.\n" });
                return;
            }
            else {
                //TODO
                res.json({ "message": "Email must follow the pattern.\n" });
                return;
            }

        }
        if (chosen_nation == "") {
            res.json({ "message": "You must fill all the fields.\n" });
            return;
        }
    }
    else {

        nation.findOne({ "name": chosen_nation }, (err, foundNation) => {
            if (err)
                console.log(err);
            else {
                if (foundNation) {
                    res.json(({ "message": "ok" }));
                    return;
                }
                else {
                    res.json(({ "message": "Nation not found!" }));
                    return;
                }
            }
        })


    }
});

router.route("/addASport").post((req, res) => {
    let search_object = {
        name: req.body.name
    };
    sport.findOne(search_object, (err, foundSport) => {
        if (err)
            console.log(err);
        else {
            if (foundSport) {
                res.json({ "message": "A sport with this name already exists." });
            }
            else {

                venue.find({ "sports.name": req.body.name }, (err2, foundVenue) => {
                    if (err2)
                        console.log(err2);
                    else {
                        if (foundVenue.length > 0) {
                            sport.collection.insertOne(search_object);
                            res.json({ "message": "You have successfully added " + req.body.name + " to the sports list." });
                        }
                        else {
                            res.json({ "message": "There are no venues that support a sport with this name " + req.body.name + "." });
                        }
                    }
                });


            }
        }
    });
});

router.route("/addADiscipline").post((req, res) => {

    discipline.findOne({ "name": req.body.name }, (err, foundDisc) => {
        if (err)
            console.log(err);
        else {
            if (foundDisc) {

                res.json({ "message": "A discipline with this name already exists." });
            }
            else {
                let obj = {
                    name: req.body.name,
                    sport: req.body.sport,
                    ind_or_group: req.body.ind_or_group
                };
                discipline.collection.insertOne(obj);
                res.json({ "message": "You have successfully added " + req.body.name + " to the discipline list" });
            }
        }
    });
});

router.route("/addACompetition").post((req, res) => {
    //original condition "competition_name": req.body.competition_name
    competition.findOne({ "discipline": req.body.discipline, "gender": req.body.gender }, (err, foundComp) => {
        if (err)
            console.log(err);
        else {
            if (foundComp) {
                //"A competition with this name already exists."
                res.json({ "message": "A competition for this discipline and gender already exists." });
            }
            else {
                let obj = {
                    competition_name: req.body.competition_name,
                    start_date: new Date(req.body.start_date),
                    end_date: new Date(req.body.end_date),
                    sport: req.body.sport,
                    discipline: req.body.discipline,
                    gender: req.body.gender,
                    format: req.body.format,
                    venues: req.body.venues,
                    participants: new Array(),
                    delegate: "",
                    formed: false,
                    over: false,
                }

                competition.collection.insertOne(obj);
                res.json({ "message": "You have successfully created a competition named " + req.body.competition_name + "." });
            }
        }
    });
});


router.route("/allCompetitions").post((req, res) => {
    competition.find({}, (err, foundComps) => {
        if (err)
            console.log(err);
        else {
            res.json(foundComps);
        }
    });
});

router.route("/competitionsNoDelegates").post((req, res) => {
    competition.find({ "delegate": "" }, (err, foundComps) => {
        if (err)
            console.log(err);
        else
            res.json(foundComps);
    });
});

router.route("/getDelegates").post((req, res) => {
    user.find({ "role": "delegate" }, (err, foundUsers) => {
        if (err)
            console.log(err);
        else
            res.json(foundUsers);
    })
});


router.route("/getOurAthletes").post((req, res) => {
    athlete.find({ "nation": req.body.nation }, (err, foundAthletes) => {
        if (err)
            console.log(err);
        else {
            res.json(foundAthletes);
        }
    });
});


router.route("/getNationByName").post((req, res) => {
    nation.findOne({ "name": req.body.nation }, (err, foundNation) => {
        if (err)
            console.log(err);
        else
            res.json(foundNation);
    });
});

router.route("/getFormatByName").post((req, res) => {
    format.findOne({ "format_name": req.body.format }, (err, foundFormat) => {
        if (err)
            console.log(err);
        else {
            res.json(foundFormat);
        }
    });
});


router.route("/getEligibleAthletes").post((req, res) => {
    athlete.find({ "gender": req.body.gender, "disciplines.discipline_name": req.body.discipline }, (err, foundAthletes) => {
        if (err)
            console.log(err);
        else {
            res.json(foundAthletes);
        }
    });
});


router.route("/checkFreeSpace").post((req, res) => {
    competition.findOne({ "discipline": req.body.discipline, "gender": req.body.gender }, (err, foundComp) => {
        if (err)
            console.log(err);
        else {
            let competition = foundComp.toObject();
            if (competition.participants.length + req.body.num_of_new_players > req.body.max_players) {
                res.json({ "message": "There are only " + (req.body.max_players - competition.participants.length) + " spaces left." });
            }
            else {
                res.json({ "message": "check_1_ok" });
            }
        }
    });
});


router.route("/checkFreeVenues").post((req, res) => {
    let arr = req.body;

    console.log('tu');

    venue.find({}, (err, foundVenues) => {
        if (err)
            console.log(err);
        else {
            if (foundVenues.length == 0) {
                res.json({ "message": "There was a problem while checking the venues, try again later." });
                return;
            }
            else {
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0; j < foundVenues.length; j++) {
                        if (foundVenues[j].toObject().name == arr[i].venue) {
                            for (let k = 0; k < foundVenues[j].toObject().busy_dates.length; k++) {
                                //start_date
                                let match_date = new Date(arr[i].date);
                                let hrs_and_minutes = arr[i].time.split(":");
                                match_date.setHours(hrs_and_minutes[0]);
                                match_date.setMinutes(hrs_and_minutes[1]);
                                // console.log(match_date.toString());
                                // console.log("my date " + foundVenues[j].toObject().busy_dates[k].start_date);
                                // console.log('----------------------------------');
                                if (match_date.toISOString() == foundVenues[j].toObject().busy_dates[k].start_date) {
                                    res.json({ "message": "The date " + match_date.toISOString() + " on venue " + arr[i].venue + " is busy. Please, choose another one" });
                                    return;
                                }
                            }
                        }
                    }
                }
                console.log("all good");

                res.json({ "message": "ok" });
                return;
            }
        }
    });

});

router.route("/checkAvailability").post((req, res) => {
    venue.findOne({ "name": req.body.venue, "busy_dates.start_date": req.body.start_date }, (err, foundVenue) => {
        if (err)
            console.log(err);
        else {
            if (foundVenue) {
                res.json({ "message": "There is a game already at the chosen time, please, choose a different time." });
            }
            else {
                //new Date(req.body.start_date)
                //DATE IS SAVED AS STRING, BECAUSE THEN COMPARISON WORKS
                //venue.collection.updateOne({"name":req.body.venue}, { $push: { "busy_dates": {start_date:req.body.start_date, gender:req.body.gender} } });
                let end_date = new Date(req.body.start_date);
                end_date.setHours(end_date.getHours() + 1);
                res.json({ "message": "check_2_ok" });
            }
        }
    });
});

router.route("/ensureMutex").post((req, res) => {
    venue.find({ "sports.name": req.body.sport, "busy_dates.start_date": req.body.start_date, "busy_dates.gender": req.body.gender }, (err, foundBusy) => {
        if (err)
            console.log(err);
        else {
            if (foundBusy.length == 0) {
                res.json({ "message": "check_3_ok" });
            }
            else {
                res.json({
                    "message": "There is already a competition from " + req.body.sport + ", for " + req.body.gender + "." +
                        " Please, choose another time."
                });
            }
        }
    });
});

router.route("/connectWithComp").post((req, res) => {

    schedule.findOne({ "id_competition": req.body.id_comp }, (err, foundSchedule) => {

        if (err)
            console.log(err);
        else {
            if (foundSchedule) {
                res.json({ "message": "already found" });
            }
            else {
                //schedule.collection.insertOne({ "id_competition": req.body.id_comp });
                res.json({ "message": "new_shall_be_made" });
            }
        }
    });
});

router.route("/checkFormedCompetition").post((req, res) => {
    competition.findById(req.body.id_comp, (err, foundComp) => {
        if (err)
            console.log(err);
        else {
            if (foundComp) {
                res.json(foundComp);
            }
        }
    })
});


router.route("/formACompetition").post((req, res) => {
    // { $set: { "mySchedule.results": schedule_obj.mySchedule.results } }
    competition.collection.updateOne({ "_id": ObjectId(req.body.id_comp) },
        { $set: { "formed": true } }, (err, success) => {
            if (err)
                console.log(err);
            else {
                res.json({ "message": "ok" });
            }
        });
});


router.route("/endCompetition").post((req, res) => {
    // { $set: { "mySchedule.results": schedule_obj.mySchedule.results } }
    competition.collection.updateOne({ "_id": ObjectId(req.body.id_comp) },
        { $set: { "over": true } }, (err, success) => {
            if (err)
                console.log(err);
            else {
                console.log(success.result);

                res.json({ "message": "ok" });
            }
        });
});


router.route("/findSchedule").post((req, res) => {
    schedule.findOne({ "id_competition": req.body.id_comp }, (err, foundComp) => {
        if (err)
            console.log(err);
        else
            res.json(foundComp);
    })
});

router.route("/getAthleteById").post((req, res) => {
    athlete.findById(req.body.athlete, (err, foundAthlete) => {
        if (err)
            console.log(err);
        else
            res.json(foundAthlete);
    });
});

//TODO redo matches
router.route("/insertResults").post((req, res) => {

    console.log('entered insert method');


    let schedule_obj = req.body.schedule_obj;
    let format_obj = req.body.format_obj;
    if (format_obj.fixture == "one_game") {
        if (format_obj.result_format == "MM:SS,TT") {
            let numeric_value_array = new Array();
            for (let i = 0; i < format_obj.num_of_players; i++) {
                let arr1 = schedule_obj.mySchedule.results[0][i].result.split(":");
                let min = parseInt(arr1[0]);
                let arr2 = arr1[1].split(",");
                let sec = parseInt(arr2[0]);
                let cent = parseInt(arr2[1]);
                console.log(min + " ," + sec + " ," + cent);
                let result = cent + sec * 100 + min * 6000;
                numeric_value_array.push({ id_player: schedule_obj.mySchedule.results[0][i].id_player, result: result });
            }

            numeric_value_array.sort(compareNumbers);

            if (!schedule_obj.mySchedule.redo) {
                //check for duplicates
                let values_existing_as_duplicates: Array<number> = new Array<number>();
                let preliminary_matrix_of_duplicates: Array<Array<any>> = new Array<Array<any>>();//CHANGED OBJECT TO ANY
                for (let i = 0; i < numeric_value_array.length; i++) {
                    //if a number already exists, do not check it again
                    if (values_existing_as_duplicates.indexOf(numeric_value_array[i].result) != -1) {
                        console.log(numeric_value_array[i]);
                        continue;
                    }
                    //create a new array only for a possibility that a new duplicate might exist.
                    preliminary_matrix_of_duplicates.push(new Array<Object>());
                    let first_time: boolean = true;
                    for (let j = 0; j < numeric_value_array.length; j++) {
                        if (i == j)         //avoids comparison with itself, this can also be inserted as a condition, that ids must differ
                            continue;
                        if (numeric_value_array[i].result == numeric_value_array[j].result) {
                            if (first_time) {
                                //push into the last one, since our index i doesn't follow the index of duplicates matrix,
                                //as new row is not instantiated in every iteration.
                                preliminary_matrix_of_duplicates[preliminary_matrix_of_duplicates.length - 1].push(numeric_value_array[i]);
                                first_time = false;
                                values_existing_as_duplicates.push(numeric_value_array[i].result);
                            }
                            preliminary_matrix_of_duplicates[preliminary_matrix_of_duplicates.length - 1].push(numeric_value_array[j]);
                        }

                    }
                }

                let final_matrix_of_duplicates: Array<Array<any>> = new Array<Array<any>>();
                for (let i = 0; i < preliminary_matrix_of_duplicates.length; i++) {
                    if (preliminary_matrix_of_duplicates[i].length > 0) {
                        final_matrix_of_duplicates.push(preliminary_matrix_of_duplicates[i]);
                    }
                }


                athlete.find({}, (errAth, foundAthletes) => {
                    if (errAth) {
                        console.log(errAth);
                    }
                    else {
                        if (foundAthletes.length == 0) {
                            res.json({ "message": JSON.stringify({ "mess": "There was a system problem, please, try again later." }) });
                        }
                        else {
                            if (final_matrix_of_duplicates.length > 0) {
                                // console.log('duplicates present');

                                for (let i = 0; i < final_matrix_of_duplicates.length; i++) {
                                    for (let j = 0; j < final_matrix_of_duplicates[i].length; j++) {
                                        for (let k = 0; k < foundAthletes.length; k++) {
                                            if (final_matrix_of_duplicates[i][j].id_player == foundAthletes[k].toObject()._id) {
                                                //console.log(foundAthletes[k].toObject()._id);
                                                //add new properties
                                                final_matrix_of_duplicates[i][j].name = foundAthletes[k].toObject().name;
                                                final_matrix_of_duplicates[i][j].surname = foundAthletes[k].toObject().surname;
                                                //console.log(final_matrix_of_duplicates[i][j].name + " - name");
                                                //console.log(final_matrix_of_duplicates[i][j].surname + " - surname");
                                            }
                                        }
                                    }
                                }
                                res.json({ "message": JSON.stringify(final_matrix_of_duplicates) });
                                return;
                            }
                            else {
                                let gold_res = numeric_value_array[0];
                                let silver_res = numeric_value_array[1];
                                let bronze_res = numeric_value_array[2];
                                schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
                                    $set: {
                                        "mySchedule": schedule_obj.mySchedule,
                                        "id_bronze": bronze_res.id_player, "id_silver": silver_res.id_player, "id_gold": gold_res.id_player
                                    }
                                });
                                athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player) }, { $set: { "medals": true } });
                                athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player) }, { $set: { "medals": true } });
                                athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player) }, { $set: { "medals": true } });

                                //find the competition in order to see which discipline should be updated
                                competition.findById(schedule_obj.id_competition, (errComp, foundCompetition) => {
                                    if (errComp)
                                        console.log(errComp);
                                    else {
                                        if (!foundCompetition) {
                                            console.log("Problem with fetching competition");
                                        }
                                        else {
                                            for (let i = 0; i < schedule_obj.mySchedule.results.length; i++) {
                                                if (schedule_obj.mySchedule.results[0][i].id_player == gold_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'gold'
                                                        }
                                                    });

                                                }
                                                else if (schedule_obj.mySchedule.results[0][i].id_player == silver_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'silver'
                                                        }
                                                    });

                                                }
                                                else if (schedule_obj.mySchedule.results[0][i].id_player == bronze_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'bronze'
                                                        }
                                                    });
                                                }
                                                else {
                                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.results[0][i].id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'none'
                                                        }
                                                    });
                                                }

                                            }
                                        }
                                    }
                                });
                                //
                                athlete.findById(ObjectId(gold_res.id_player), (err, foundGold) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundGold) {
                                            let gold_obj = foundGold.toObject();
                                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "gold_cnt": 1 } });
                                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });



                                athlete.findById(ObjectId(silver_res.id_player), (err, foundSilver) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundSilver) {
                                            let silver_obj = foundSilver.toObject();
                                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "silver_cnt": 1 } });
                                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });



                                athlete.findById(ObjectId(bronze_res.id_player), (err, foundBronze) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundBronze) {
                                            let bronze_obj = foundBronze.toObject();
                                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "bronze_cnt": 1 } });
                                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });

                                res.json({ "message": "You have successfully inserted all the results." });
                                return;

                            }
                        }
                    }
                });

            }
            else {
                //redo
                let redo_object = schedule_obj.mySchedule.redo;
                for (let i = 0; i < redo_object.length; i++) {
                    //array for sorting by new results
                    let helper_array = new Array();
                    for (let j = 0; j < redo_object[i].length; j++) {
                        let arr1 = redo_object[i][j].result.split(":");
                        let min = parseInt(arr1[0]);
                        let arr2 = arr1[1].split(",");
                        let sec = parseInt(arr2[0]);
                        let cent = parseInt(arr2[1]);
                        let result = cent + sec * 100 + min * 6000;
                        helper_array.push({ id_player: redo_object[i][j].id_player, result: result });
                    }
                    //at the moment, the elements in help_array are sorted in the same way as they were in
                    //numeric_value_array.
                    //since numeric_value_array is used only to see who has got the medals,
                    //and has either its first or last 3 elements used for that,
                    //I can modify the positions, so I will now save the indexes of
                    //the ones that were duplicated, and then I will make the numeric_value_array
                    //elements of those indexes point to the elements from helper_array.
                    let indexes = new Array();
                    for (let j = 0; j < helper_array.length; j++) {
                        for (let k = 0; k < numeric_value_array.length; k++) {
                            if (numeric_value_array[k].id_player == helper_array[j].id_player)
                                indexes.push(k);
                        }
                    }
                    //now i have a helper array, which is sorted by new results.
                    helper_array.sort(compareNumbers);
                    //helper array and indexes have the same length
                    //indexes should be sorted in old order, because everything else came sorted
                    //log them just in case
                    console.log('indexes');

                    for (let j = 0; j < indexes.length; j++) {
                        console.log(indexes[j]);
                        //rearrange
                        numeric_value_array[indexes[j]] = helper_array[j];
                    }

                }
                //ready for insertion

                let gold_res = numeric_value_array[0];
                let silver_res = numeric_value_array[1];
                let bronze_res = numeric_value_array[2];




                schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
                    $set: {
                        "mySchedule": schedule_obj.mySchedule,
                        "id_bronze": bronze_res.id_player, "id_silver": silver_res.id_player, "id_gold": gold_res.id_player
                    }
                });
                athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player) }, { $set: { "medals": true } });

                //find the competition in order to see which discipline should be updated
                competition.findById(schedule_obj.id_competition, (errComp, foundCompetition) => {
                    if (errComp)
                        console.log(errComp);
                    else {
                        if (!foundCompetition) {
                            console.log("Problem with fetching competition");
                        }
                        else {
                            for (let i = 0; i < schedule_obj.mySchedule.results[0].length; i++) {

                                console.log('from schedule');

                                console.log(schedule_obj.mySchedule.results[0][i].id_player);
                                if (schedule_obj.mySchedule.results[0][i].id_player == gold_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'gold'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.results[0][i].id_player == silver_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'silver'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.results[0][i].id_player == bronze_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'bronze'
                                        }
                                    });
                                }
                                else {
                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.results[0][i].id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'none'
                                        }
                                    });
                                }

                            }
                        }
                    }
                });



                athlete.findById(ObjectId(gold_res.id_player), (err, foundGold) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundGold) {
                            let gold_obj = foundGold.toObject();
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "gold_cnt": 1 } });
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(silver_res.id_player), (err, foundSilver) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundSilver) {
                            let silver_obj = foundSilver.toObject();
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "silver_cnt": 1 } });
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(bronze_res.id_player), (err, foundBronze) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundBronze) {
                            let bronze_obj = foundBronze.toObject();
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "bronze_cnt": 1 } });
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });

                res.json({ "message": JSON.stringify({ "mess": "You have successfully inserted all the results." }) });
                return;

            }

            //////////////////////////////////////////

        }
        if (format_obj.result_format == "M,CM") {
            let numeric_value_array = new Array();
            for (let i = 0; i < format_obj.num_of_players; i++) {
                let best = 0;
                for (let j = 0; j < format_obj.num_of_reps; j++) {
                    let arr = schedule_obj.mySchedule.results[j][i].result.split(",");
                    let meters = arr[0];
                    let centimeters = arr[1];
                    // console.log(meters +" ," +centimeters);

                    //The next piece of code can be used to parse adequatly,
                    //in case I permitt the user to send single digits numbers

                    // if(meters.length==1) {
                    //     meters = parseInt(meters) * 10;
                    // }
                    // else {  
                    //     //05 can be parsed correctly
                    //     meters = parseInt(meters);
                    // }
                    // if(centimeters.length==1) {
                    //     centimeters = parseInt(centimeters) * 10;
                    // }
                    // else 
                    //     centimeters = parseInt(centimeters);
                    let result = parseInt(centimeters) + 100 * parseInt(meters);
                    if (result > best)
                        best = result;
                }
                numeric_value_array.push({ id_player: schedule_obj.mySchedule.results[0][i].id_player, result: best });
            }
            numeric_value_array.sort(compareNumbers);
            // for(let i = 0; i< numeric_value_array.length;i++) {
            //     console.log(numeric_value_array[i]);

            // }
            if (!schedule_obj.mySchedule.redo) {
                //check for duplicates
                let values_existing_as_duplicates: Array<number> = new Array<number>();
                let preliminary_matrix_of_duplicates: Array<Array<any>> = new Array<Array<any>>();//CHANGED OBJECT TO ANY
                for (let i = 0; i < numeric_value_array.length; i++) {
                    //if a number already exists, do not check it again
                    if (values_existing_as_duplicates.indexOf(numeric_value_array[i].result) != -1) {
                        console.log(numeric_value_array[i]);
                        continue;
                    }
                    //create a new array only for a possibility that a new duplicate might exist.
                    preliminary_matrix_of_duplicates.push(new Array<Object>());
                    let first_time: boolean = true;
                    for (let j = 0; j < numeric_value_array.length; j++) {
                        if (i == j)         //avoids comparison with itself, this can also be inserted as a condition, that ids must differ
                            continue;
                        if (numeric_value_array[i].result == numeric_value_array[j].result) {
                            if (first_time) {
                                //push into the last one, since our index i doesn't follow the index of duplicates matrix,
                                //as new row is not instantiated in every iteration.
                                preliminary_matrix_of_duplicates[preliminary_matrix_of_duplicates.length - 1].push(numeric_value_array[i]);
                                first_time = false;
                                values_existing_as_duplicates.push(numeric_value_array[i].result);
                            }
                            preliminary_matrix_of_duplicates[preliminary_matrix_of_duplicates.length - 1].push(numeric_value_array[j]);
                        }

                    }
                }
                let final_matrix_of_duplicates: Array<Array<any>> = new Array<Array<any>>();
                for (let i = 0; i < preliminary_matrix_of_duplicates.length; i++) {
                    if (preliminary_matrix_of_duplicates[i].length > 0) {
                        final_matrix_of_duplicates.push(preliminary_matrix_of_duplicates[i]);
                    }
                }

                athlete.find({}, (errAth, foundAthletes) => {
                    if (errAth) {
                        //console.log('error with athletes');

                        console.log(errAth);
                    }
                    else {
                        if (foundAthletes.length == 0) {

                            res.json({ "message": JSON.stringify({ "mess": "There was a system problem, please, try again later." }) });
                        }
                        else {
                            if (final_matrix_of_duplicates.length > 0) {
                                // console.log('duplicates present');

                                for (let i = 0; i < final_matrix_of_duplicates.length; i++) {
                                    for (let j = 0; j < final_matrix_of_duplicates[i].length; j++) {
                                        for (let k = 0; k < foundAthletes.length; k++) {
                                            if (final_matrix_of_duplicates[i][j].id_player == foundAthletes[k].toObject()._id) {
                                                //console.log(foundAthletes[k].toObject()._id);
                                                //add new properties
                                                final_matrix_of_duplicates[i][j].name = foundAthletes[k].toObject().name;
                                                final_matrix_of_duplicates[i][j].surname = foundAthletes[k].toObject().surname;
                                                //console.log(final_matrix_of_duplicates[i][j].name + " - name");
                                                //console.log(final_matrix_of_duplicates[i][j].surname + " - surname");
                                            }
                                        }
                                    }
                                }
                                res.json({ "message": JSON.stringify(final_matrix_of_duplicates) });
                                return;
                            }
                            else {
                                let gold_res = numeric_value_array[numeric_value_array.length - 1];
                                let silver_res = numeric_value_array[numeric_value_array.length - 2];
                                let bronze_res = numeric_value_array[numeric_value_array.length - 3];


                                schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
                                    $set: {
                                        "mySchedule": schedule_obj.mySchedule,
                                        "id_bronze": bronze_res.id_player, "id_silver": silver_res.id_player, "id_gold": gold_res.id_player
                                    }
                                });
                                athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player) }, { $set: { "medals": true } });
                                athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player) }, { $set: { "medals": true } });
                                athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player) }, { $set: { "medals": true } });



                                //find the competition in order to see which discipline should be updated
                                competition.findById(schedule_obj.id_competition, (errComp, foundCompetition) => {
                                    if (errComp)
                                        console.log(errComp);
                                    else {
                                        if (!foundCompetition) {
                                            console.log("Problem with fetching competition");
                                        }
                                        else {
                                            for (let i = 0; i < schedule_obj.mySchedule.results[0].length; i++) {
                                                if (schedule_obj.mySchedule.results[0][i].id_player == gold_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'gold'
                                                        }
                                                    });

                                                }
                                                else if (schedule_obj.mySchedule.results[0][i].id_player == silver_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'silver'
                                                        }
                                                    });

                                                }
                                                else if (schedule_obj.mySchedule.results[0][i].id_player == bronze_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'bronze'
                                                        }
                                                    });
                                                }
                                                else {
                                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.results[0][i].id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'none'
                                                        }
                                                    });
                                                }

                                            }
                                        }
                                    }
                                });

                                athlete.findById(ObjectId(gold_res.id_player), (err, foundGold) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundGold) {
                                            let gold_obj = foundGold.toObject();
                                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "gold_cnt": 1 } });
                                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });



                                athlete.findById(ObjectId(silver_res.id_player), (err, foundSilver) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundSilver) {
                                            let silver_obj = foundSilver.toObject();
                                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "silver_cnt": 1 } });
                                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });



                                athlete.findById(ObjectId(bronze_res.id_player), (err, foundBronze) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundBronze) {
                                            let bronze_obj = foundBronze.toObject();
                                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "bronze_cnt": 1 } });
                                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });
                                res.json({ "message": JSON.stringify({ "mess": "You have successfully inserted all the results." }) });
                                return;
                            }
                        }
                    }
                });

            }
            else {
                //there was a redo object
                let redo_object = schedule_obj.mySchedule.redo;
                /////

                for (let i = 0; i < redo_object.length; i++) {
                    //array for sorting by new results
                    let helper_array = new Array();
                    for (let j = 0; j < redo_object[i].length; j++) {
                        let arr = redo_object[i][j].result.split(",");
                        let meters = arr[0];
                        let centimeters = arr[1];
                        let result = parseInt(centimeters) + 100 * parseInt(meters);
                        helper_array.push({ id_player: redo_object[i][j].id_player, result: result });
                    }
                    //at the moment, the elements in help_array are sorted in the same way as they were in
                    //numeric_value_array.
                    //since numeric_value_array is used only to see who has got the medals,
                    //and has either its first or last 3 elements used for that,
                    //I can modify the positions, so I will now save the indexes of
                    //the ones that were duplicated, and then I will make the numeric_value_array
                    //elements of those indexes point to the elements from helper_array.
                    let indexes = new Array();
                    for (let j = 0; j < helper_array.length; j++) {
                        for (let k = 0; k < numeric_value_array.length; k++) {
                            if (numeric_value_array[k].id_player == helper_array[j].id_player)
                                indexes.push(k);
                        }
                    }
                    //now i have a helper array, which is sorted by new results.
                    helper_array.sort(compareNumbers);
                    //helper array and indexes have the same length
                    //indexes should be sorted in old order, because everything else came sorted
                    //log them just in case
                    console.log('indexes');

                    for (let j = 0; j < indexes.length; j++) {
                        console.log(indexes[j]);
                        //rearrange
                        numeric_value_array[indexes[j]] = helper_array[j];
                    }
                }

                let gold_res = numeric_value_array[numeric_value_array.length - 1];
                let silver_res = numeric_value_array[numeric_value_array.length - 2];
                let bronze_res = numeric_value_array[numeric_value_array.length - 3];

                schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
                    $set: {
                        "mySchedule": schedule_obj.mySchedule,
                        "id_bronze": bronze_res.id_player, "id_silver": silver_res.id_player, "id_gold": gold_res.id_player
                    }
                });
                athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player) }, { $set: { "medals": true } });

                //find the competition in order to see which discipline should be updated
                competition.findById(schedule_obj.id_competition, (errComp, foundCompetition) => {
                    if (errComp)
                        console.log(errComp);
                    else {
                        if (!foundCompetition) {
                            console.log("Problem with fetching competition");
                        }
                        else {
                            for (let i = 0; i < schedule_obj.mySchedule.results[0].length; i++) {
                                if (schedule_obj.mySchedule.results[0][i].id_player == gold_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'gold'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.results[0][i].id_player == silver_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'silver'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.results[0][i].id_player == bronze_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'bronze'
                                        }
                                    });
                                }
                                else {
                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.results[0][i].id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'none'
                                        }
                                    });
                                }

                            }
                        }
                    }
                });


                athlete.findById(ObjectId(gold_res.id_player), (err, foundGold) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundGold) {
                            let gold_obj = foundGold.toObject();
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "gold_cnt": 1 } });
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(silver_res.id_player), (err, foundSilver) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundSilver) {
                            let silver_obj = foundSilver.toObject();
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "silver_cnt": 1 } });
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(bronze_res.id_player), (err, foundBronze) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundBronze) {
                            let bronze_obj = foundBronze.toObject();
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "bronze_cnt": 1 } });
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });


                res.json({ "message": JSON.stringify({ "mess": "You have successfully inserted all the results." }) });
                return;
            }
        }
        if (format_obj.result_format == "SS,TT") {
            let numeric_value_array = new Array();
            for (let i = 0; i < format_obj.num_of_players; i++) {
                let arr = schedule_obj.mySchedule.results[0][i].result.split(",");
                let sec = arr[0];
                let cent = arr[1];
                //console.log(sec +" ," +cent);
                let result = parseInt(cent) + 100 * parseInt(sec);
                numeric_value_array.push({ id_player: schedule_obj.mySchedule.results[0][i].id_player, result: result });
            }
            numeric_value_array.sort(compareNumbers);
            if (!schedule_obj.mySchedule.redo) {
                //check for duplicates
                let values_existing_as_duplicates: Array<number> = new Array<number>();
                let preliminary_matrix_of_duplicates: Array<Array<any>> = new Array<Array<any>>();//CHANGED OBJECT TO ANY
                for (let i = 0; i < numeric_value_array.length; i++) {
                    //if a number already exists, do not check it again
                    if (values_existing_as_duplicates.indexOf(numeric_value_array[i].result) != -1) {
                        console.log(numeric_value_array[i]);
                        continue;
                    }
                    //create a new array only for a possibility that a new duplicate might exist.
                    preliminary_matrix_of_duplicates.push(new Array<Object>());
                    let first_time: boolean = true;
                    for (let j = 0; j < numeric_value_array.length; j++) {
                        if (i == j)         //avoids comparison with itself, this can also be inserted as a condition, that ids must differ
                            continue;
                        if (numeric_value_array[i].result == numeric_value_array[j].result) {
                            if (first_time) {
                                //push into the last one, since our index i doesn't follow the index of duplicates matrix,
                                //as new row is not instantiated in every iteration.
                                preliminary_matrix_of_duplicates[preliminary_matrix_of_duplicates.length - 1].push(numeric_value_array[i]);
                                first_time = false;
                                values_existing_as_duplicates.push(numeric_value_array[i].result);
                            }
                            preliminary_matrix_of_duplicates[preliminary_matrix_of_duplicates.length - 1].push(numeric_value_array[j]);
                        }

                    }
                }

                let final_matrix_of_duplicates: Array<Array<any>> = new Array<Array<any>>();
                for (let i = 0; i < preliminary_matrix_of_duplicates.length; i++) {
                    if (preliminary_matrix_of_duplicates[i].length > 0) {
                        final_matrix_of_duplicates.push(preliminary_matrix_of_duplicates[i]);
                    }
                }

                athlete.find({}, (errAth, foundAthletes) => {
                    if (errAth) {
                        //console.log('error with athletes');
                        console.log(errAth);
                    }
                    else {
                        if (foundAthletes.length == 0) {

                            res.json({ "message": JSON.stringify({ "mess": "There was a system problem, please, try again later." }) });
                        }
                        else {
                            if (final_matrix_of_duplicates.length > 0) {
                                // console.log('duplicates present');

                                for (let i = 0; i < final_matrix_of_duplicates.length; i++) {
                                    for (let j = 0; j < final_matrix_of_duplicates[i].length; j++) {
                                        for (let k = 0; k < foundAthletes.length; k++) {
                                            if (final_matrix_of_duplicates[i][j].id_player == foundAthletes[k].toObject()._id) {
                                                //console.log(foundAthletes[k].toObject()._id);
                                                //add new properties
                                                final_matrix_of_duplicates[i][j].name = foundAthletes[k].toObject().name;
                                                final_matrix_of_duplicates[i][j].surname = foundAthletes[k].toObject().surname;
                                                //console.log(final_matrix_of_duplicates[i][j].name + " - name");
                                                //console.log(final_matrix_of_duplicates[i][j].surname + " - surname");
                                            }
                                        }
                                    }
                                }
                                res.json({ "message": JSON.stringify(final_matrix_of_duplicates) });
                                return;
                            }
                            else {
                                //no duplicates, regular execution
                                let gold_res = numeric_value_array[0];
                                let silver_res = numeric_value_array[1];
                                let bronze_res = numeric_value_array[2];
                                schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
                                    $set: {
                                        "mySchedule": schedule_obj.mySchedule,
                                        "id_bronze": bronze_res.id_player, "id_silver": silver_res.id_player, "id_gold": gold_res.id_player
                                    }
                                });
                                athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player) }, { $set: { "medals": true } });
                                athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player) }, { $set: { "medals": true } });
                                athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player) }, { $set: { "medals": true } });


                                //find the competition in order to see which discipline should be updated
                                competition.findById(schedule_obj.id_competition, (errComp, foundCompetition) => {
                                    if (errComp)
                                        console.log(errComp);
                                    else {
                                        if (!foundCompetition) {
                                            console.log("Problem with fetching competition");
                                        }
                                        else {
                                            for (let i = 0; i < schedule_obj.mySchedule.results[0].length; i++) {
                                                if (schedule_obj.mySchedule.results[0][i].id_player == gold_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'gold'
                                                        }
                                                    });

                                                }
                                                else if (schedule_obj.mySchedule.results[0][i].id_player == silver_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'silver'
                                                        }
                                                    });

                                                }
                                                else if (schedule_obj.mySchedule.results[0][i].id_player == bronze_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'bronze'
                                                        }
                                                    });
                                                }
                                                else {
                                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.results[0][i].id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'none'
                                                        }
                                                    });
                                                }

                                            }
                                        }
                                    }
                                });


                                athlete.findById(ObjectId(gold_res.id_player), (err, foundGold) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundGold) {
                                            let gold_obj = foundGold.toObject();
                                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "gold_cnt": 1 } });
                                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });



                                athlete.findById(ObjectId(silver_res.id_player), (err, foundSilver) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundSilver) {
                                            let silver_obj = foundSilver.toObject();
                                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "silver_cnt": 1 } });
                                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });



                                athlete.findById(ObjectId(bronze_res.id_player), (err, foundBronze) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundBronze) {
                                            let bronze_obj = foundBronze.toObject();
                                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "bronze_cnt": 1 } });
                                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });


                                res.json({ "message": JSON.stringify({ "mess": "You have successfully inserted all the results." }) });
                                return;


                            }
                        }
                    }
                });


            }
            else {
                //there was a redo object
                let redo_object = schedule_obj.mySchedule.redo;

                for (let i = 0; i < redo_object.length; i++) {
                    //array for sorting by new results
                    let helper_array = new Array();
                    for (let j = 0; j < redo_object[i].length; j++) {
                        let arr = redo_object[i][j].result.split(",");
                        let sec = arr[0];
                        let cent = arr[1];
                        //console.log(sec +" ," +cent);
                        let result = parseInt(cent) + 100 * parseInt(sec);
                        helper_array.push({ id_player: redo_object[i][j].id_player, result: result });
                    }
                    //at the moment, the elements in help_array are sorted in the same way as they were in
                    //numeric_value_array.
                    //since numeric_value_array is used only to see who has got the medals,
                    //and has either its first or last 3 elements used for that,
                    //I can modify the positions, so I will now save the indexes of
                    //the ones that were duplicated, and then I will make the numeric_value_array
                    //elements of those indexes point to the elements from helper_array.
                    let indexes = new Array();
                    for (let j = 0; j < helper_array.length; j++) {
                        for (let k = 0; k < numeric_value_array.length; k++) {
                            if (numeric_value_array[k].id_player == helper_array[j].id_player)
                                indexes.push(k);
                        }
                    }
                    //now i have a helper array, which is sorted by new results.
                    helper_array.sort(compareNumbers);
                    //helper array and indexes have the same length
                    //indexes should be sorted in old order, because everything else came sorted
                    //log them just in case
                    console.log('indexes');

                    for (let j = 0; j < indexes.length; j++) {
                        console.log(indexes[j]);
                        //rearrange
                        numeric_value_array[indexes[j]] = helper_array[j];
                    }
                }
                //ready for insertion
                let gold_res = numeric_value_array[0];
                let silver_res = numeric_value_array[1];
                let bronze_res = numeric_value_array[2];

                schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
                    $set: {
                        "mySchedule": schedule_obj.mySchedule,
                        "id_bronze": bronze_res.id_player, "id_silver": silver_res.id_player, "id_gold": gold_res.id_player
                    }
                });
                athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player) }, { $set: { "medals": true } });

                //find the competition in order to see which discipline should be updated
                competition.findById(schedule_obj.id_competition, (errComp, foundCompetition) => {
                    if (errComp)
                        console.log(errComp);
                    else {
                        if (!foundCompetition) {
                            console.log("Problem with fetching competition");
                        }
                        else {
                            for (let i = 0; i < schedule_obj.mySchedule.results[0].length; i++) {
                                if (schedule_obj.mySchedule.results[0][i].id_player == gold_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'gold'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.results[0][i].id_player == silver_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'silver'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.results[0][i].id_player == bronze_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'bronze'
                                        }
                                    });
                                }
                                else {
                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.results[0][i].id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'none'
                                        }
                                    });
                                }

                            }
                        }
                    }
                });



                athlete.findById(ObjectId(gold_res.id_player), (err, foundGold) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundGold) {
                            let gold_obj = foundGold.toObject();
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "gold_cnt": 1 } });
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(silver_res.id_player), (err, foundSilver) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundSilver) {
                            let silver_obj = foundSilver.toObject();
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "silver_cnt": 1 } });
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(bronze_res.id_player), (err, foundBronze) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundBronze) {
                            let bronze_obj = foundBronze.toObject();
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "bronze_cnt": 1 } });
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });


                res.json({ "message": JSON.stringify({ "mess": "You have successfully inserted all the results." }) });
                return;
            }


        }
        if (format_obj.result_format == "HH:MM:SS") {
            let numeric_value_array = new Array();
            //TODO see whether to change because of dynamics of format creation
            for (let i = 0; i < format_obj.num_of_players; i++) {
                let arr = schedule_obj.mySchedule.results[0][i].result.split(":");
                let hr = arr[0];
                let min = arr[1];
                let sec = arr[2];
                //console.log(hr + " " + min + " " + sec);
                let result = parseInt(sec) + parseInt(min) * 60 + parseInt(hr) * 3600;
                numeric_value_array.push({ id_player: schedule_obj.mySchedule.results[0][i].id_player, result: result });
            }


            numeric_value_array.sort(compareNumbers);


            //must check for duplicates
            if (!schedule_obj.mySchedule.redo) {

                //console.log("No duplicates yet");

                //check for duplicates
                let values_existing_as_duplicates: Array<number> = new Array<number>();
                let preliminary_matrix_of_duplicates: Array<Array<any>> = new Array<Array<any>>();//CHANGED OBJECT TO ANY
                for (let i = 0; i < numeric_value_array.length; i++) {
                    //if a number already exists, do not check it again
                    if (values_existing_as_duplicates.indexOf(numeric_value_array[i].result) != -1) {
                        console.log(numeric_value_array[i]);
                        continue;
                    }
                    //create a new array only for a possibility that a new duplicate might exist.
                    preliminary_matrix_of_duplicates.push(new Array<Object>());
                    let first_time: boolean = true;
                    for (let j = 0; j < numeric_value_array.length; j++) {
                        if (i == j)         //avoids comparison with itself, this can also be inserted as a condition, that ids must differ
                            continue;
                        if (numeric_value_array[i].result == numeric_value_array[j].result) {
                            if (first_time) {
                                //push into the last one, since our index i doesn't follow the index of duplicates matrix,
                                //as new row is not instantiated in every iteration.
                                preliminary_matrix_of_duplicates[preliminary_matrix_of_duplicates.length - 1].push(numeric_value_array[i]);
                                first_time = false;
                                values_existing_as_duplicates.push(numeric_value_array[i].result);
                            }
                            preliminary_matrix_of_duplicates[preliminary_matrix_of_duplicates.length - 1].push(numeric_value_array[j]);
                        }

                    }
                }

                let final_matrix_of_duplicates: Array<Array<any>> = new Array<Array<any>>();
                for (let i = 0; i < preliminary_matrix_of_duplicates.length; i++) {
                    if (preliminary_matrix_of_duplicates[i].length > 0) {
                        final_matrix_of_duplicates.push(preliminary_matrix_of_duplicates[i]);
                    }
                }
                console.log('passed duplicate search');

                athlete.find({}, (errAth, foundAthletes) => {
                    if (errAth) {
                        //console.log('error with athletes');

                        console.log(errAth);
                    }
                    else {
                        if (foundAthletes.length == 0) {

                            res.json({ "message": JSON.stringify({ "mess": "There was a system problem, please, try again later." }) });
                        }
                        else {
                            if (final_matrix_of_duplicates.length > 0) {
                                // console.log('duplicates present');

                                for (let i = 0; i < final_matrix_of_duplicates.length; i++) {
                                    for (let j = 0; j < final_matrix_of_duplicates[i].length; j++) {
                                        for (let k = 0; k < foundAthletes.length; k++) {
                                            if (final_matrix_of_duplicates[i][j].id_player == foundAthletes[k].toObject()._id) {
                                                //console.log(foundAthletes[k].toObject()._id);
                                                //add new properties
                                                final_matrix_of_duplicates[i][j].name = foundAthletes[k].toObject().name;
                                                final_matrix_of_duplicates[i][j].surname = foundAthletes[k].toObject().surname;
                                                //console.log(final_matrix_of_duplicates[i][j].name + " - name");
                                                //console.log(final_matrix_of_duplicates[i][j].surname + " - surname");
                                            }
                                        }
                                    }
                                }
                                res.json({ "message": JSON.stringify(final_matrix_of_duplicates) });
                                return;
                            }
                            else {

                                console.log('no duplicates');
                                let gold_res = numeric_value_array[0];
                                let silver_res = numeric_value_array[1];
                                let bronze_res = numeric_value_array[2];

                                schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
                                    $set: {
                                        "mySchedule": schedule_obj.mySchedule,
                                        "id_bronze": bronze_res.id_player, "id_silver": silver_res.id_player, "id_gold": gold_res.id_player
                                    }
                                });
                                athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player) }, { $set: { "medals": true } });
                                athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player) }, { $set: { "medals": true } });
                                athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player) }, { $set: { "medals": true } });


                                //find the competition in order to see which discipline should be updated
                                competition.findById(schedule_obj.id_competition, (errComp, foundCompetition) => {
                                    if (errComp)
                                        console.log(errComp);
                                    else {
                                        if (!foundCompetition) {
                                            console.log("Problem with fetching competition");
                                        }
                                        else {
                                            for (let i = 0; i < schedule_obj.mySchedule.results.length; i++) {
                                                if (schedule_obj.mySchedule.results[0][i].id_player == gold_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'gold'
                                                        }
                                                    });

                                                }
                                                else if (schedule_obj.mySchedule.results[0][i].id_player == silver_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'silver'
                                                        }
                                                    });

                                                }
                                                else if (schedule_obj.mySchedule.results[0][i].id_player == bronze_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'bronze'
                                                        }
                                                    });
                                                }
                                                else {
                                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.results[0][i].id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'none'
                                                        }
                                                    });
                                                }

                                            }
                                        }
                                    }
                                });

                                athlete.findById(ObjectId(gold_res.id_player), (err, foundGold) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundGold) {
                                            let gold_obj = foundGold.toObject();
                                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "gold_cnt": 1 } });
                                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });



                                athlete.findById(ObjectId(silver_res.id_player), (err, foundSilver) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundSilver) {
                                            let silver_obj = foundSilver.toObject();
                                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "silver_cnt": 1 } });
                                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });



                                athlete.findById(ObjectId(bronze_res.id_player), (err, foundBronze) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundBronze) {
                                            let bronze_obj = foundBronze.toObject();
                                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "bronze_cnt": 1 } });
                                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });

                                res.json({ "message": JSON.stringify({ "mess": "You have successfully inserted all the results." }) });
                                return;
                            }

                        }
                    }

                });
            }

            else {
                //there was a redo object
                //numeric_value_array is already sorted here
                //redo is a matrix of {id_player:val, result:val}
                //result is a string
                console.log('must redo');

                let redo_object = schedule_obj.mySchedule.redo;

                for (let i = 0; i < redo_object.length; i++) {
                    //array for sorting by new results
                    let helper_array = new Array();
                    for (let j = 0; j < redo_object[i].length; j++) {
                        let arr = redo_object[i][j].result.split(":");
                        let hr = arr[0];
                        let min = arr[1];
                        let sec = arr[2];
                        console.log(hr + " " + min + " " + sec);
                        let result = parseInt(sec) + parseInt(min) * 60 + parseInt(hr) * 3600;
                        helper_array.push({ id_player: redo_object[i][j].id_player, result: result });
                    }
                    //at the moment, the elements in help_array are sorted in the same way as they were in
                    //numeric_value_array.
                    //since numeric_value_array is used only to see who has got the medals,
                    //and has either its first or last 3 elements used for that,
                    //I can modify the positions, so I will now save the indexes of
                    //the ones that were duplicated, and then I will make the numeric_value_array
                    //elements of those indexes point to the elements from helper_array.
                    let indexes = new Array();
                    for (let j = 0; j < helper_array.length; j++) {
                        for (let k = 0; k < numeric_value_array.length; k++) {
                            if (numeric_value_array[k].id_player == helper_array[j].id_player)
                                indexes.push(k);
                        }
                    }
                    //now i have a helper array, which is sorted by new results.
                    helper_array.sort(compareNumbers);
                    //helper array and indexes have the same length
                    //indexes should be sorted in old order, because everything else came sorted
                    //log them just in case
                    console.log('indexes');

                    for (let j = 0; j < indexes.length; j++) {
                        console.log(indexes[j]);
                        //rearrange
                        numeric_value_array[indexes[j]] = helper_array[j];
                    }
                }

                console.log('numeric array');

                for (let i = 0; i < numeric_value_array.length; i++) {
                    console.log(numeric_value_array[i]);

                }

                //now we are ready for insertion
                console.log('no duplicates');
                let gold_res = numeric_value_array[0];
                let silver_res = numeric_value_array[1];
                let bronze_res = numeric_value_array[2];

                schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
                    $set: {
                        "mySchedule": schedule_obj.mySchedule,
                        "id_bronze": bronze_res.id_player, "id_silver": silver_res.id_player, "id_gold": gold_res.id_player
                    }
                });
                athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player) }, { $set: { "medals": true } });


                console.log(' gold, silver, bronze');
                console.log(gold_res.id_player);
                console.log(silver_res.id_player);
                console.log(bronze_res.id_player);

                //find the competition in order to see which discipline should be updated
                competition.findById(schedule_obj.id_competition, (errComp, foundCompetition) => {
                    if (errComp)
                        console.log(errComp);
                    else {
                        if (!foundCompetition) {
                            console.log("Problem with fetching competition");
                        }
                        else {
                            console.log('prep for insertion');

                            for (let i = 0; i < schedule_obj.mySchedule.results[0].length; i++) {
                                console.log('from schedule');

                                console.log(schedule_obj.mySchedule.results[0][i].id_player);



                                if (schedule_obj.mySchedule.results[0][i].id_player == gold_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'gold'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.results[0][i].id_player == silver_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'silver'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.results[0][i].id_player == bronze_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'bronze'
                                        }
                                    });
                                }
                                else {
                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.results[0][i].id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'none'
                                        }
                                    });
                                }

                            }
                        }
                    }
                });

                athlete.findById(ObjectId(gold_res.id_player), (err, foundGold) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundGold) {
                            let gold_obj = foundGold.toObject();
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "gold_cnt": 1 } });
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(silver_res.id_player), (err, foundSilver) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundSilver) {
                            let silver_obj = foundSilver.toObject();
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "silver_cnt": 1 } });
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(bronze_res.id_player), (err, foundBronze) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundBronze) {
                            let bronze_obj = foundBronze.toObject();
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "bronze_cnt": 1 } });
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });

                res.json({ "message": JSON.stringify({ "mess": "You have successfully inserted all the results." }) });
                return;


            }
        }

        if (format_obj.result_format == "circles") {
            //my assumption is that scores from all six
            //round are added to a final score
            let numeric_value_array = new Array();
            for (let i = 0; i < schedule_obj.mySchedule.results[0].length; i++) {
                //for each athlete
                numeric_value_array.push({ id_player: schedule_obj.mySchedule.results[0][i].id_player, result: 0 });
            }

            //sums their results
            for (let i = 0; i < format_obj.num_of_players; i++) {
                let sum = 0;
                for (let j = 0; j < format_obj.num_of_reps; j++) {
                    sum = sum + parseInt(schedule_obj.mySchedule.results[j][i].result);
                }
                numeric_value_array[i].result = sum;
            }


            numeric_value_array.sort(compareNumbers);

            if (!schedule_obj.mySchedule.redo) {
                //check for duplicates
                let values_existing_as_duplicates: Array<number> = new Array<number>();
                let preliminary_matrix_of_duplicates: Array<Array<any>> = new Array<Array<any>>();//CHANGED OBJECT TO ANY
                for (let i = 0; i < numeric_value_array.length; i++) {
                    //if a number already exists, do not check it again
                    if (values_existing_as_duplicates.indexOf(numeric_value_array[i].result) != -1) {
                        console.log(numeric_value_array[i]);
                        continue;
                    }
                    //create a new array only for a possibility that a new duplicate might exist.
                    preliminary_matrix_of_duplicates.push(new Array<Object>());
                    let first_time: boolean = true;
                    for (let j = 0; j < numeric_value_array.length; j++) {
                        if (i == j)         //avoids comparison with itself, this can also be inserted as a condition, that ids must differ
                            continue;
                        if (numeric_value_array[i].result == numeric_value_array[j].result) {
                            if (first_time) {
                                //push into the last one, since our index i doesn't follow the index of duplicates matrix,
                                //as new row is not instantiated in every iteration.
                                preliminary_matrix_of_duplicates[preliminary_matrix_of_duplicates.length - 1].push(numeric_value_array[i]);
                                first_time = false;
                                values_existing_as_duplicates.push(numeric_value_array[i].result);
                            }
                            preliminary_matrix_of_duplicates[preliminary_matrix_of_duplicates.length - 1].push(numeric_value_array[j]);
                        }

                    }
                }

                let final_matrix_of_duplicates: Array<Array<any>> = new Array<Array<any>>();
                for (let i = 0; i < preliminary_matrix_of_duplicates.length; i++) {
                    if (preliminary_matrix_of_duplicates[i].length > 0) {
                        final_matrix_of_duplicates.push(preliminary_matrix_of_duplicates[i]);
                    }
                }

                athlete.find({}, (errAth, foundAthletes) => {
                    if (errAth) {
                        console.log(errAth);
                    }
                    else {
                        if (foundAthletes.length == 0) {
                            res.json({ "message": JSON.stringify({ "mess": "There was a system problem, please, try again later." }) });
                        }
                        else {
                            if (final_matrix_of_duplicates.length > 0) {
                                // console.log('duplicates present');

                                for (let i = 0; i < final_matrix_of_duplicates.length; i++) {
                                    for (let j = 0; j < final_matrix_of_duplicates[i].length; j++) {
                                        for (let k = 0; k < foundAthletes.length; k++) {
                                            if (final_matrix_of_duplicates[i][j].id_player == foundAthletes[k].toObject()._id) {
                                                //console.log(foundAthletes[k].toObject()._id);
                                                //add new properties
                                                final_matrix_of_duplicates[i][j].name = foundAthletes[k].toObject().name;
                                                final_matrix_of_duplicates[i][j].surname = foundAthletes[k].toObject().surname;
                                                //console.log(final_matrix_of_duplicates[i][j].name + " - name");
                                                //console.log(final_matrix_of_duplicates[i][j].surname + " - surname");
                                            }
                                        }
                                    }
                                }
                                res.json({ "message": JSON.stringify(final_matrix_of_duplicates) });
                                return;
                            }
                            else {
                                let gold_res = numeric_value_array[numeric_value_array.length - 1];
                                let silver_res = numeric_value_array[numeric_value_array.length - 2];
                                let bronze_res = numeric_value_array[numeric_value_array.length - 3];

                                schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
                                    $set: {
                                        "mySchedule": schedule_obj.mySchedule,
                                        "id_bronze": bronze_res.id_player, "id_silver": silver_res.id_player, "id_gold": gold_res.id_player
                                    }
                                });
                                athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player) }, { $set: { "medals": true } });
                                athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player) }, { $set: { "medals": true } });
                                athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player) }, { $set: { "medals": true } });

                                //find the competition in order to see which discipline should be updated
                                competition.findById(schedule_obj.id_competition, (errComp, foundCompetition) => {
                                    if (errComp)
                                        console.log(errComp);
                                    else {
                                        if (!foundCompetition) {
                                            console.log("Problem with fetching competition");
                                        }
                                        else {
                                            for (let i = 0; i < schedule_obj.mySchedule.results[0].length; i++) {
                                                if (schedule_obj.mySchedule.results[0][i].id_player == gold_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'gold'
                                                        }
                                                    });

                                                }
                                                else if (schedule_obj.mySchedule.results[0][i].id_player == silver_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'silver'
                                                        }
                                                    });

                                                }
                                                else if (schedule_obj.mySchedule.results[0][i].id_player == bronze_res.id_player) {
                                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'bronze'
                                                        }
                                                    });
                                                }
                                                else {
                                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.results[0][i].id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                                        '$set': {
                                                            'disciplines.$.medal': 'none'
                                                        }
                                                    });
                                                }

                                            }
                                        }
                                    }
                                });


                                athlete.findById(ObjectId(gold_res.id_player), (err, foundGold) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundGold) {
                                            let gold_obj = foundGold.toObject();
                                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "gold_cnt": 1 } });
                                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });



                                athlete.findById(ObjectId(silver_res.id_player), (err, foundSilver) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundSilver) {
                                            let silver_obj = foundSilver.toObject();
                                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "silver_cnt": 1 } });
                                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });



                                athlete.findById(ObjectId(bronze_res.id_player), (err, foundBronze) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        if (foundBronze) {
                                            let bronze_obj = foundBronze.toObject();
                                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "bronze_cnt": 1 } });
                                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "overall": 1 } });
                                        }
                                    }
                                });

                                res.json({ "message": JSON.stringify({ "mess": "You have successfully inserted all the results." }) });
                                return;

                            }
                        }
                    }
                });

            }
            else {
                //redo object found
                let redo_object = schedule_obj.mySchedule.redo;

                for (let i = 0; i < redo_object.length; i++) {
                    //array for sorting by new results
                    let helper_array = new Array();
                    for (let j = 0; j < redo_object[i].length; j++) {
                        let result = parseInt(redo_object[i][j].result);
                        helper_array.push({ id_player: redo_object[i][j].id_player, result: result });
                    }
                    //at the moment, the elements in help_array are sorted in the same way as they were in
                    //numeric_value_array.
                    //since numeric_value_array is used only to see who has got the medals,
                    //and has either its first or last 3 elements used for that,
                    //I can modify the positions, so I will now save the indexes of
                    //the ones that were duplicated, and then I will make the numeric_value_array
                    //elements of those indexes point to the elements from helper_array.
                    let indexes = new Array();
                    for (let j = 0; j < helper_array.length; j++) {
                        for (let k = 0; k < numeric_value_array.length; k++) {
                            if (numeric_value_array[k].id_player == helper_array[j].id_player)
                                indexes.push(k);
                        }
                    }
                    //now i have a helper array, which is sorted by new results.
                    helper_array.sort(compareNumbers);
                    //helper array and indexes have the same length
                    //indexes should be sorted in old order, because everything else came sorted
                    //log them just in case
                    console.log('indexes');

                    for (let j = 0; j < indexes.length; j++) {
                        console.log(indexes[j]);
                        //rearrange
                        numeric_value_array[indexes[j]] = helper_array[j];
                    }
                }

                let gold_res = numeric_value_array[numeric_value_array.length - 1];
                let silver_res = numeric_value_array[numeric_value_array.length - 2];
                let bronze_res = numeric_value_array[numeric_value_array.length - 3];
                // console.log(gold_res);
                // console.log(silver_res);
                // console.log(bronze_res);

                schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
                    $set: {
                        "mySchedule": schedule_obj.mySchedule,
                        "id_bronze": bronze_res.id_player, "id_silver": silver_res.id_player, "id_gold": gold_res.id_player
                    }
                });
                athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player) }, { $set: { "medals": true } });


                //find the competition in order to see which discipline should be updated
                competition.findById(schedule_obj.id_competition, (errComp, foundCompetition) => {
                    if (errComp)
                        console.log(errComp);
                    else {
                        if (!foundCompetition) {
                            console.log("Problem with fetching competition");
                        }
                        else {
                            for (let i = 0; i < schedule_obj.mySchedule.results[0].length; i++) {
                                if (schedule_obj.mySchedule.results[0][i].id_player == gold_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'gold'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.results[0][i].id_player == silver_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'silver'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.results[0][i].id_player == bronze_res.id_player) {
                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res.id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'bronze'
                                        }
                                    });
                                }
                                else {
                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.results[0][i].id_player), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'none'
                                        }
                                    });
                                }

                            }
                        }
                    }
                });


                athlete.findById(ObjectId(gold_res.id_player), (err, foundGold) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundGold) {
                            let gold_obj = foundGold.toObject();
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "gold_cnt": 1 } });
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(silver_res.id_player), (err, foundSilver) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundSilver) {
                            let silver_obj = foundSilver.toObject();
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "silver_cnt": 1 } });
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(bronze_res.id_player), (err, foundBronze) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundBronze) {
                            let bronze_obj = foundBronze.toObject();
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "bronze_cnt": 1 } });
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });

                res.json({ "message": JSON.stringify({ "mess": "You have successfully inserted all the results." }) });
                return;


            }

        }

    }
    else {
        //tennis, knockout
        //update schedule
        schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
            $set: {
                "mySchedule": schedule_obj.mySchedule,
            }
        });
        for (let i = 0; i < schedule_obj.mySchedule.left_bracket.length; i++) {
            if (schedule_obj.mySchedule.left_bracket[i].done == false) {
                //not played yet
                let match_date = new Date(schedule_obj.mySchedule.left_bracket[i].date);
                let hrs_and_minutes = schedule_obj.mySchedule.left_bracket[i].time.split(":");
                match_date.setHours(hrs_and_minutes[0]);
                match_date.setMinutes(hrs_and_minutes[1]);
                venue.collection.updateOne({ "name": schedule_obj.mySchedule.left_bracket[i].venue },
                    { $push: { "busy_dates": { start_date: match_date.toISOString(), gender: req.body.gender } } });
            }
        }
        for (let i = 0; i < schedule_obj.mySchedule.right_bracket.length; i++) {
            if (schedule_obj.mySchedule.right_bracket[i].done == false) {
                //not played yet
                let match_date = new Date(schedule_obj.mySchedule.right_bracket[i].date);
                let hrs_and_minutes = schedule_obj.mySchedule.right_bracket[i].time.split(":");
                match_date.setHours(hrs_and_minutes[0]);
                match_date.setMinutes(hrs_and_minutes[1]);
                venue.collection.updateOne({ "name": schedule_obj.mySchedule.right_bracket[i].venue },
                    { $push: { "busy_dates": { start_date: match_date.toISOString(), gender: req.body.gender } } });
            }
        }
        //finals and 3rd place playoff are formed simulatenously, so it is enough to check just one condition
        //finals is always left, and playoff is always right
        if (schedule_obj.mySchedule.left_bracket[schedule_obj.mySchedule.left_bracket.length - 1].round == 2) {
            //finals and playoffs
            if (schedule_obj.mySchedule.left_bracket[schedule_obj.mySchedule.left_bracket.length - 1].done) {
                //done=="done"
                //id_p1 id_p2, p1_res, p2_res
                let gold_res: string, silver_res: string, bronze_res: string;
                if (parseInt(schedule_obj.mySchedule.left_bracket[schedule_obj.mySchedule.left_bracket.length - 1].p1_res)
                    > parseInt(schedule_obj.mySchedule.left_bracket[schedule_obj.mySchedule.left_bracket.length - 1].p2_res)) {
                    gold_res = schedule_obj.mySchedule.left_bracket[schedule_obj.mySchedule.left_bracket.length - 1].id_p1;
                    silver_res = schedule_obj.mySchedule.left_bracket[schedule_obj.mySchedule.left_bracket.length - 1].id_p2;
                }
                else {
                    gold_res = schedule_obj.mySchedule.left_bracket[schedule_obj.mySchedule.left_bracket.length - 1].id_p2;
                    silver_res = schedule_obj.mySchedule.left_bracket[schedule_obj.mySchedule.left_bracket.length - 1].id_p1;
                }
                if (parseInt(schedule_obj.mySchedule.right_bracket[schedule_obj.mySchedule.right_bracket.length - 1].p1_res) >
                    parseInt(schedule_obj.mySchedule.right_bracket[schedule_obj.mySchedule.right_bracket.length - 1].p2_res)) {
                    bronze_res = schedule_obj.mySchedule.right_bracket[schedule_obj.mySchedule.right_bracket.length - 1].id_p1;
                }
                else {

                    bronze_res = schedule_obj.mySchedule.right_bracket[schedule_obj.mySchedule.right_bracket.length - 1].id_p2;
                }
                schedule_obj.mySchedule.left_bracket[schedule_obj.mySchedule.left_bracket.length - 1].done = true;
                schedule_obj.mySchedule.right_bracket[schedule_obj.mySchedule.right_bracket.length - 1].done = true;
                schedule.collection.updateOne({ "_id": ObjectId(schedule_obj._id) }, {
                    $set: {
                        "mySchedule": schedule_obj.mySchedule,
                        "id_bronze": bronze_res, "id_silver": silver_res, "id_gold": gold_res
                    }
                });
                athlete.collection.updateOne({ "_id": ObjectId(gold_res) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(silver_res) }, { $set: { "medals": true } });
                athlete.collection.updateOne({ "_id": ObjectId(bronze_res) }, { $set: { "medals": true } });

                //to find a discipline in which players should have their medals updated
                competition.findById(schedule_obj.id_competition, (errComp, foundCompetition) => {
                    if (errComp)
                        console.log(errComp);
                    else {
                        if (!foundCompetition) {
                            console.log('Problem with finding the competition');
                        }
                        else {
                            let original_num_of_players = schedule_obj.mySchedule.left_bracket[0].round;
                            let limit = original_num_of_players / 4;
                            //the limit is used to iterate through matches within brackets, and update these players,
                            //so if there are 16 players, that would mean 8 players per bracket, or 4 matches per bracket,
                            //so that first four elements within a bracket should have their players updated,
                            //with adding a matching medal, or a "none" value, in case that they didn't win anything.
                            //left bracket
                            for (let i = 0; i < limit; i++) {

                                //LEFT BRACKET

                                //update player 1
                                if (schedule_obj.mySchedule.left_bracket[i].id_p1 == gold_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'gold'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.left_bracket[i].id_p1 == silver_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'silver'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.left_bracket[i].id_p1 == bronze_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'bronze'
                                        }
                                    });
                                }
                                else {
                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.left_bracket[i].id_p1), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'none'
                                        }
                                    });
                                }
                                //update player 2
                                if (schedule_obj.mySchedule.left_bracket[i].id_p2 == gold_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'gold'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.left_bracket[i].id_p2 == silver_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'silver'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.left_bracket[i].id_p2 == bronze_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'bronze'
                                        }
                                    });
                                }
                                else {
                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.left_bracket[i].id_p2), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'none'
                                        }
                                    });
                                }

                                //RIGHT BRACKET 

                                //update player 1
                                if (schedule_obj.mySchedule.right_bracket[i].id_p1 == gold_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'gold'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.right_bracket[i].id_p1 == silver_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'silver'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.right_bracket[i].id_p1 == bronze_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'bronze'
                                        }
                                    });
                                }
                                else {
                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.right_bracket[i].id_p1), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'none'
                                        }
                                    });
                                }
                                //update player 2
                                if (schedule_obj.mySchedule.right_bracket[i].id_p2 == gold_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(gold_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'gold'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.right_bracket[i].id_p2 == silver_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(silver_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'silver'
                                        }
                                    });

                                }
                                else if (schedule_obj.mySchedule.right_bracket[i].id_p2 == bronze_res) {
                                    athlete.collection.updateOne({ "_id": ObjectId(bronze_res), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'bronze'
                                        }
                                    });
                                }
                                else {
                                    athlete.collection.updateOne({ "_id": ObjectId(schedule_obj.mySchedule.right_bracket[i].id_p2), "disciplines.discipline_name": foundCompetition.toObject().discipline }, {
                                        '$set': {
                                            'disciplines.$.medal': 'none'
                                        }
                                    });
                                }
                            }
                        }
                    }
                });



                athlete.findById(ObjectId(gold_res), (err, foundGold) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundGold) {
                            let gold_obj = foundGold.toObject();
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "gold_cnt": 1 } });
                            nation.collection.updateOne({ "name": gold_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(silver_res), (err, foundSilver) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundSilver) {
                            let silver_obj = foundSilver.toObject();
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "silver_cnt": 1 } });
                            nation.collection.updateOne({ "name": silver_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



                athlete.findById(ObjectId(bronze_res), (err, foundBronze) => {
                    if (err)
                        console.log(err);
                    else {
                        if (foundBronze) {
                            let bronze_obj = foundBronze.toObject();
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "bronze_cnt": 1 } });
                            nation.collection.updateOne({ "name": bronze_obj.nation }, { $inc: { "overall": 1 } });
                        }
                    }
                });



            }
        }

        console.log('finally here');
        res.json({ "message": "ok" });
    }

});



function compareNumbers(a: any, b: any) {
    if (a.result < b.result) {
        return -1;
    }
    if (a.result > b.result) {
        return 1;
    }
    return 0;
}



router.route("/addMoreAthletes").post((req, res) => {
    let athletes = req.body.athletes;//array{id_player:value}
    let comp_id = req.body.comp_id;
    let format = req.body.format;//one_game or knockout
    let num_of_reps = req.body.num_of_reps;

    if (format == "one_game") {
        let to_add = new Array();
        let not_to_add = new Array();
        competition.findById(comp_id, (err, found) => {
            if (err)
                console.log(err);
            else {
                if (found) {
                    let compObj = found.toObject();
                    for (let i = 0; i < athletes.length; i++) {
                        let found = false;
                        for (let j = 0; j < compObj.participants.length; j++) {
                            if (athletes[i].id_player == compObj.participants[j].id_player) {
                                not_to_add.push(athletes[i]);
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            to_add.push(athletes[i]);
                            console.log(athletes[i].id_player);

                        }
                    }

                    for (let i = 0; i < to_add.length; i++) {
                        competition.collection.updateOne({ "_id": ObjectId(comp_id) }, { $push: { "participants": { id_player: to_add[i].id_player } } });
                    }
                    schedule.findOne({ "id_competition": comp_id }, (err2, foundSchedule) => {
                        if (err2) {
                            console.log(err2);
                        }
                        else {
                            if (foundSchedule) {
                                //I get the original matrix the DB,
                                // then I put the new elements here,
                                //and push the new matrix back, essentialy
                                //swapping the mySchedule.results matrix
                                let schedule_obj = foundSchedule.toObject();

                                for (let i = 0; i < num_of_reps; i++) {
                                    for (let j = 0; j < to_add.length; j++) {
                                        schedule_obj.mySchedule.results[i].
                                            push({ id_player: to_add[j].id_player, result: "" });
                                    }
                                }
                                // for (let index = 0; index < num_of_reps; index++) {
                                //     for (let j = 0; j < schedule_obj.mySchedule.results[index].length; j++) {

                                //         console.log(schedule_obj.mySchedule.results[index][j]);

                                //     }

                                // }

                                schedule.collection.updateOne({ "id_competition": comp_id }, { $set: { "mySchedule.results": schedule_obj.mySchedule.results } });
                                res.json({ "were_not_added": not_to_add });
                            }
                            else
                                console.log('not ok');
                        }
                    })


                }
                else {
                    res.json({ "message": "Error:Competition not found!" });
                }
            }
        });
    }
    else {
        //knockout
    }

});


router.route("/InsertSchedule").post((req, res) => {
    schedule.collection.insertOne(req.body);
    //venue.collection.updateOne({"name":req.body.venue}, { $push: { "busy_dates": {start_date:req.body.start_date, gender:req.body.gender} } });
    for (let i = 0; i < req.body.mySchedule.results[0].length; i++) {
        competition.collection.updateOne({ "_id": ObjectId(req.body.id_competition) }, { $push: { "participants": { id_player: req.body.mySchedule.results[0][i].id_player } } });
    }
    res.json({ "message": "Ok" });
});

router.route("/InsertKnockoutSchedule").post((req, res) => {
    schedule.collection.insertOne(req.body.schedule);
    for (let i = 0; i < req.body.schedule.mySchedule.left_bracket.length; i++) {
        competition.collection.updateOne({ "_id": ObjectId(req.body.schedule.id_competition) }, { $push: { "participants": { id_player: req.body.schedule.mySchedule.left_bracket[i].id_p1 } } });
        competition.collection.updateOne({ "_id": ObjectId(req.body.schedule.id_competition) }, { $push: { "participants": { id_player: req.body.schedule.mySchedule.left_bracket[i].id_p2 } } });
        let match_date = new Date(req.body.schedule.mySchedule.left_bracket[i].date);
        let hrs_and_minutes = req.body.schedule.mySchedule.left_bracket[i].time.split(":");
        match_date.setHours(hrs_and_minutes[0]);
        match_date.setMinutes(hrs_and_minutes[1]);

        venue.collection.updateOne({ "name": req.body.schedule.mySchedule.left_bracket[i].venue }, { $push: { "busy_dates": { start_date: match_date.toISOString(), gender: req.body.gender } } });
    }
    for (let i = 0; i < req.body.schedule.mySchedule.right_bracket.length; i++) {
        competition.collection.updateOne({ "_id": ObjectId(req.body.schedule.id_competition) }, { $push: { "participants": { id_player: req.body.schedule.mySchedule.right_bracket[i].id_p1 } } });
        competition.collection.updateOne({ "_id": ObjectId(req.body.schedule.id_competition) }, { $push: { "participants": { id_player: req.body.schedule.mySchedule.right_bracket[i].id_p2 } } });
        let match_date = new Date(req.body.schedule.mySchedule.right_bracket[i].date);
        let hrs_and_minutes = req.body.schedule.mySchedule.right_bracket[i].time.split(":");
        match_date.setHours(hrs_and_minutes[0]);
        match_date.setMinutes(hrs_and_minutes[1]);
        venue.collection.updateOne({ "name": req.body.schedule.mySchedule.right_bracket[i].venue }, { $push: { "busy_dates": { start_date: match_date.toISOString(), gender: req.body.gender } } });
    }

    res.json({ "message": "Ok" });

});



router.route("/setBusyVenue").post((req, res) => {
    venue.collection.updateOne({ "name": req.body.venue }, { $push: { "busy_dates": { start_date: req.body.start_date, gender: req.body.gender } } });
    res.json({ "message": "You have successfully created a schedule." });
});

router.route("/assignDelegate").post((req, res) => {
    competition.find({ "delegate": req.body.username }, (err, foundComp) => {
        if (err)
            console.log(err);
        else {
            if (!foundComp) {
                //should never happen
                res.json({ "message": "There was a problem with database, please try again later." });
            }
            else {
                if (foundComp.length >= 3) {
                    res.json({ "message": "This delegate already has 3 or more competitions assigned to them. please, choose another one." });
                }
                else {
                    //should never find it, since the passed competition certainly
                    //has no delegate
                    competition.findOne({ "discipline": req.body.discipline, "gender": req.body.gender }, (err2, foundTheComp) => {
                        if (err2)
                            console.log(err2);
                        else {
                            if (!foundTheComp) {
                                //should never happen
                                res.json({ "message": "There was a problem with database, please try again later." });
                            }
                            else {
                                let compObj = foundTheComp.toObject();
                                if (compObj.delegate != "") {
                                    res.json({ "message": "A delegate is already assigned to this competition" });
                                }
                                else {


                                    competition.collection.updateOne({ "discipline": req.body.discipline, "gender": req.body.gender }, { $set: { "delegate": req.body.username } }, () => {
                                        res.json({ "message": "You have succesfully assigned a delegate with username " + req.body.username + " for " + req.body.discipline + ", " + req.body.gender + "." });
                                    });
                                }
                            }
                        }
                    });
                }
            }
        }
    });
});

router.route("/addAFormat").post((req, res) => {
    format.findOne({ "format_name": req.body.format_name }, (err, foundFormat) => {
        if (err)
            console.log(err);
        else {
            if (foundFormat) {
                res.json({ "message": "A format with this name already exists." });
            }
            else {
                let obj = {
                    format_name: req.body.format_name,
                    fixture: req.body.fixture,
                    num_of_players: parseInt(req.body.num_of_players),
                    result_format: req.body.result_format,
                    num_of_reps: parseInt(req.body.num_of_reps)
                }
                format.collection.insertOne(obj);
                res.json({ "message": "You have successfully added a format named " + req.body.format_name + "." });
            }
        }
    });
});

router.route("/insertJSON").post((req, res) => {
    let json_obj = req.body.json_file;
    let my_nation = req.body.nation;
    let personal = /[A-Z][a-z]*/;
    console.log(json_obj);
    if (!json_obj.hasOwnProperty("myAthletes")) {
        //doesn't contain the property
        res.json({ "message": "Your file must contain a field named 'myAthletes'." });
        return;
    }

    if (!Array.isArray(json_obj["myAthletes"])) {
        //myAthlete object is not an array
        res.json({ "message": "A property named myAthletes must be an array." });
        return;
    }
    if (json_obj["myAthletes"].length == 0) {
        //an array is empty
        res.json({ "message": "You must import at least one athlete." });
        return;
    }
    for (let i = 0; i < json_obj["myAthletes"].length; i++) {
        //name
        if (!json_obj["myAthletes"][i].hasOwnProperty("name")) {
            res.json({ "message": "All athletes must have a name." });
            return;
        }
        else {
            if (json_obj["myAthletes"][i].name == "" || !personal.test(json_obj["myAthletes"][i].name)) {
                res.json({ "message": "A name must start with a capital letter, and can only contain letters." });
                return;
            }
        }
        //surname
        if (!json_obj["myAthletes"][i].hasOwnProperty("surname")) {
            res.json({ "message": "All athletes must have a surname." });
            return;
        }
        else {
            if (json_obj["myAthletes"][i].surname == "" || !personal.test(json_obj["myAthletes"][i].surname)) {
                res.json({ "message": "A surname must start with a capital letter, and can only contain letters." });
                return;
            }
        }
        //nation
        if (!json_obj["myAthletes"][i].hasOwnProperty("nation")) {
            res.json({ "message": "All athletes must have a nation." });
            return;
        }
        else {
            if (json_obj["myAthletes"][i].nation == "" || !personal.test(json_obj["myAthletes"][i].nation)) {
                res.json({ "message": "A nation must start with a capital letter, and can only contain letters." });
                return;
            }
        }
        //gender 
        if (!json_obj["myAthletes"][i].hasOwnProperty("gender")) {
            res.json({ "message": "All athletes must have a gender." });
            return;
        }
        else {
            if (!(json_obj["myAthletes"][i].gender == "male") && !(json_obj["myAthletes"][i].gender == "female")) {
                res.json({ "message": "A gender must be either male or female." });
                return
            }
        }
        //sport, correct words will be checked through DB later
        if (!json_obj["myAthletes"][i].hasOwnProperty("sport")) {
            res.json({ "message": "All athletes must have their sport." });
            return;
        }
        //disciplines
        if (!json_obj["myAthletes"][i].hasOwnProperty("disciplines")) {
            res.json({ "message": "All athletes must have some disciplines that they will participate in." });
            return;
        }
        if (!Array.isArray(json_obj["myAthletes"][i].disciplines)) {
            res.json({ "message": "A list of disciplines must exist." });
            return;
        }
        if (json_obj["myAthletes"][i].disciplines.length == 0) {
            res.json({ "message": "A list of disciplines cannot be empty." });
            return;
        }
        for (let j = 0; j < json_obj["myAthletes"][i].disciplines.length; j++) {
            if (!json_obj["myAthletes"][i].disciplines[j].hasOwnProperty("discipline_name")) {
                res.json({ "message": "A discipline must have its own name." });
                return;
            }
            //valid names will be checked with database later
            if (json_obj["myAthletes"][i].disciplines[j]["discipline_name"] == "") {
                res.json({ "message": "A discipline name cannot be empty." });
                return;
            }
            if (!json_obj["myAthletes"][i].disciplines[j].hasOwnProperty("medal")) {
                res.json({ "message": "An athlete must have a space for his medals." });
                return;
            }
            if (json_obj["myAthletes"][i].disciplines[j]["medal"] != "") {
                res.json({ "message": "A space for the medal must be empty." });
                return;
            }
        }
        if (!json_obj["myAthletes"][i].hasOwnProperty("medals")) {
            res.json({ "message": "An athlete must have a space for medals note" });
            return;
        }
        if (typeof json_obj["myAthletes"][i].medals != "boolean") {
            res.json({ "message": "A medals space must be a true/false value, which is false at first." });
            return;
        }
        if (json_obj["myAthletes"][i].medals) {
            res.json({ "message": "The original value of medals field must be false." });
            return;
        }
        if (!json_obj["myAthletes"][i].hasOwnProperty("carrier")) {
            res.json({ "message": "A carrier field must exist." });
            return;
        }
        if (json_obj["myAthletes"][i].sport == "Tennis") {
            if (json_obj["myAthletes"][i].carrier < 1 || json_obj["myAthletes"][i].carrier > 16) {
                res.json({ "message": "A tennis carrier can be from first to sixteenth." });
                return;
            }
        }
        else {
            if (json_obj["myAthletes"][i].carrier != 0) {
                res.json({ "message": "A non-tennis player must have 0 value for his carrier field." });
                return;
            }
        }

    }

    for (let i = 0; i < json_obj["myAthletes"].length; i++) {
        for (let j = i + 1; j < json_obj["myAthletes"].length; j++) {
            if ((json_obj["myAthletes"][i].name == json_obj["myAthletes"][j].name) &&
                (json_obj["myAthletes"][i].surname == json_obj["myAthletes"][j].surname) &&
                (json_obj["myAthletes"][i].sport == json_obj["myAthletes"][j].sport)) {
                res.json({ "message": "You cannot submit multiple instances of the same athlete." });
                return;
            }
        }
    }

    for (let i = 1; i <= 16; i++) {
        let counter = 0;
        for (let j = 0; j < json_obj["myAthletes"].length; j++) {
            if (json_obj["myAthletes"][j].sport == "Tennis") {
                if (json_obj["myAthletes"][j].carrier == i) {
                    counter++
                }
            }
        }
        if (counter > 1) {
            res.json({ "message": "There cannot be multiple same carriers." });
            return;
        }
    }


    for (let i = 0; i < json_obj["myAthletes"].length; i++) {
        if (json_obj["myAthletes"][i].nation != my_nation) {
            res.json({ "message": "All athletes must be the same nation as you." });
            return;
        }
    }


    sport.find({}, (err, foundSports) => {
        if (err) {
            console.log(err);
        }
        else {
            if (foundSports.length == 0) {
                res.json({ "message": "There was a problem, please try again." });
                return;
            }
            else {
                for (let i = 0; i < json_obj.myAthletes.length; i++) {
                    let found_match: boolean = false;
                    for (let j = 0; j < foundSports.length; j++) {
                        if (json_obj.myAthletes[i].sport == foundSports[j].toObject().name) {
                            found_match = true;
                            break;
                        }
                    }
                    if (!found_match) {
                        res.json({ "message": "Inserted sport named '" + json_obj.myAthletes[i].sport + "' doesn't exist in the database." });
                        return;
                    }
                }

                athlete.find({}, (err2, foundAthletes) => {
                    if (err2)
                        console.log(err2);
                    else {
                        if (foundAthletes.length != 0) {
                            //if found other athletes
                            for (let i = 0; i < json_obj.myAthletes.length; i++) {
                                let found_match: boolean = false;
                                for (let j = 0; j < foundAthletes.length; j++) {
                                    if (json_obj.myAthletes[i].name == foundAthletes[j].toObject().name &&
                                        json_obj.myAthletes[i].surname == foundAthletes[j].toObject().surname &&
                                        json_obj.myAthletes[i].nation == foundAthletes[j].toObject().nation &&
                                        json_obj.myAthletes[i].sport == foundAthletes[j].toObject().sport) {
                                        found_match = true;
                                        break;
                                    }
                                }
                                if (found_match) {
                                    res.json({ "message": json_obj.myAthletes[i].name + " " + json_obj.myAthletes[i].surname + ", from" + json_obj.myAthletes[i].nation + ", who participates in " + json_obj.myAthletes[i].sport + ", already exists." });
                                    return;
                                }

                            }

                            for (let i = 0; i < json_obj.myAthletes.length; i++) {
                                if (json_obj.myAthletes[i].sport != "Tennis")
                                    continue;
                                for (let j = 0; j < foundAthletes.length; j++) {
                                    if ((json_obj.myAthletes[i].carrier == foundAthletes[j].toObject().carrier) && (json_obj.myAthletes[i].gender == foundAthletes[j].toObject().gender)) {
                                        res.json({ "message": "The carrier with value " + json_obj.myAthletes[i].carrier + ", in " + json_obj.myAthletes[i].gender + " competition already exists." });
                                        return;
                                    }
                                }
                            }


                        }

                        //check the formed competitons for men
                        competition.find({ "gender": "male", "formed": true }, (err3, foundComps) => {
                            if (err3)
                                console.log(err3);
                            else {
                                if (foundComps.length > 0) {
                                    for (let i = 0; i < json_obj.myAthletes.length; i++) {
                                        if (json_obj.myAthletes[i].gender != "male")
                                            continue;
                                        for (let j = 0; j < json_obj.myAthletes[i].disciplines.length; j++) {
                                            for (let k = 0; k < foundComps.length; k++) {
                                                if (json_obj.myAthletes[i].disciplines[j].discipline_name == foundComps[k].toObject().discipline) {
                                                    res.json({ "message": "A competition for the " + json_obj.myAthletes[i].sport + ", " + json_obj.myAthletes[i].disciplines[j].discipline_name + ", for men, is already formed." });
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                }
                                //check for the formed competitions for women
                                competition.find({ "gender": "female", "formed": true }, (err4, foundFComps) => {
                                    if (err4)
                                        console.log(err4);
                                    else {
                                        if (foundFComps.length > 0) {
                                            for (let i = 0; i < json_obj.myAthletes.length; i++) {
                                                if (json_obj.myAthletes[i].gender != "female")
                                                    continue;
                                                for (let j = 0; j < json_obj.myAthletes[i].disciplines.length; j++) {
                                                    for (let k = 0; k < foundFComps.length; k++) {
                                                        if (json_obj.myAthletes[i].disciplines[j].discipline_name == foundFComps[k].toObject().discipline) {
                                                            res.json({ "message": "A competition for the " + json_obj.myAthletes[i].sport + ", " + json_obj.myAthletes[i].disciplines[j].discipline_name + ", for women, is already formed." });
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        //everything ok
                                        for (let i = 0; i < json_obj.myAthletes.length; i++) {
                                            athlete.collection.insertOne(json_obj.myAthletes[i]);
                                            nation.collection.updateOne({ "name": json_obj.myAthletes[i].nation }, { $inc: { "athlete_cnt": 1 } });
                                        }
                                        res.json({ "message": "You have successfully submitted " + json_obj.myAthletes.length + " athletes for Olympic games." });
                                        //res.json({ "message": "ok" });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});


router.route("/submitAnAthlete").post((req, res) => {
    athlete.findOne({
        "name": req.body.name, "surname": req.body.surname, "nation":
            req.body.nation, "sport": req.body.sport
    }, (err, foundAthlete) => {
        if (err)
            console.log(err);
        else {
            if (foundAthlete) {
                res.json({ "message": "This athlete already exists." });
            }
            else {
                //see if any competition for the chosen discipline
                //is already formed

                // competition.findOne({"discipline":req.body.discipline, "gender":req.body.gender}, (err, foundComp) => {
                //     console.log(' pozvao');
                // });
                let results = new Array();
                competition.find({ "gender": req.body.gender, "formed": true }, (err1, foundComps) => {
                    if (err1)
                        console.log(err1);
                    else {

                        if (!foundComps) {
                            //no confirmed competitions for that gender
                            // should rarely happen
                            //must insert an object like this, to avoid inserting an empty string
                            //for _id

                            if (req.body.sport == "Tennis") {
                                athlete.findOne({ "carrier": req.body.carrier }, (errCarr, foundCarrier) => {
                                    if (errCarr) {
                                        console.log(errCarr);

                                    } else {
                                        if (foundCarrier) {
                                            res.json({ "message": "This carrier already exists. Please, try another one." });
                                        }
                                        else {

                                            let obj = {
                                                name: req.body.name,
                                                surname: req.body.surname,
                                                nation: req.body.nation,
                                                gender: req.body.gender,
                                                sport: req.body.sport,
                                                //check for deep/shallow copy
                                                disciplines: req.body.disciplines,
                                                medals: req.body.medals,
                                                carrier: req.body.carrier
                                            }
                                            athlete.collection.insertOne(obj);
                                            nation.collection.updateOne({ "name": obj.nation }, { $inc: { "athlete_cnt": 1 } });
                                            res.json({ "message": "You have successfully submitted " + req.body.name + " " + req.body.surname + " for Olympic games." });
                                        }
                                    }

                                });
                            }
                            else {
                                let obj = {
                                    name: req.body.name,
                                    surname: req.body.surname,
                                    nation: req.body.nation,
                                    gender: req.body.gender,
                                    sport: req.body.sport,
                                    //check for deep/shallow copy
                                    disciplines: req.body.disciplines,
                                    medals: req.body.medals,
                                    carrier: req.body.carrier
                                }
                                athlete.collection.insertOne(obj);
                                nation.collection.updateOne({ "name": obj.nation }, { $inc: { "athlete_cnt": 1 } });
                                res.json({ "message": "You have successfully submitted " + req.body.name + " " + req.body.surname + " for Olympic games." });
                            }
                        }
                        else {
                            for (let i = 0; i < foundComps.length; i++) {
                                results.push(foundComps[i].toObject());
                            }

                            let already_formed = new Array();

                            for (let i = 0; i < req.body.disciplines.length; i++) {
                                for (let j = 0; j < results.length; j++) {
                                    if (req.body.disciplines[i].discipline_name == results[j].discipline) {
                                        already_formed.push(req.body.disciplines[i]);
                                    }
                                }
                            }
                            if (already_formed.length > 0) {
                                let return_string = already_formed[0].discipline_name;
                                for (let i = 1; i < already_formed.length; i++) {
                                    return_string += ", " + already_formed[i].discipline_name;
                                }
                                if (already_formed.length == 1) {
                                    return_string += " has its application closed.";
                                    res.json({ "message": return_string });
                                }
                                else {
                                    return_string += " have their applications closed.";
                                    res.json({ "message": return_string });
                                }
                            }
                            else {

                                if (req.body.sport == "Tennis") {
                                    athlete.findOne({ "carrier": req.body.carrier }, (errCarr, foundCarrier) => {
                                        if (errCarr) {
                                            console.log(errCarr);

                                        } else {
                                            if (foundCarrier) {
                                                res.json({ "message": "This carrier already exists. Please, try another one." });
                                            }
                                            else {

                                                let obj = {
                                                    name: req.body.name,
                                                    surname: req.body.surname,
                                                    nation: req.body.nation,
                                                    gender: req.body.gender,
                                                    sport: req.body.sport,
                                                    //check for deep/shallow copy
                                                    disciplines: req.body.disciplines,
                                                    medals: req.body.medals,
                                                    carrier: req.body.carrier
                                                }
                                                athlete.collection.insertOne(obj);
                                                nation.collection.updateOne({ "name": obj.nation }, { $inc: { "athlete_cnt": 1 } });
                                                res.json({ "message": "You have successfully submitted " + req.body.name + " " + req.body.surname + " for Olympic games." });
                                            }
                                        }

                                    });
                                }
                                else {
                                    let obj = {
                                        name: req.body.name,
                                        surname: req.body.surname,
                                        nation: req.body.nation,
                                        gender: req.body.gender,
                                        sport: req.body.sport,
                                        //check for deep/shallow copy
                                        disciplines: req.body.disciplines,
                                        medals: req.body.medals,
                                        carrier: req.body.carrier
                                    }
                                    athlete.collection.insertOne(obj);
                                    nation.collection.updateOne({ "name": obj.nation }, { $inc: { "athlete_cnt": 1 } });
                                    res.json({ "message": "You have successfully submitted " + req.body.name + " " + req.body.surname + " for Olympic games." });

                                }
                            }
                        }
                    }
                });
            }
        }
    });
});


router.route("/isCompetitionFormed").post((req, res) => {
    competition.findOne({ "discipline": req.body.discipline, "gender": req.body.gender, "formed": true }, (err, foundComp) => {
        if (err) {
            console.log(err);
            //res.json({"message":"An error occurred."});
            return;
        }
        else {
            if (foundComp) {
                res.json({ "message": "not_ok" });
            }
            else {
                res.json({ "message": "ok" });
            }
        }
    });
});


router.route("/delegatesCompetition").post((req, res) => {
    competition.find({ "delegate": req.body.username }, (err, foundComps) => {
        if (err)
            console.log(err);
        else {
            res.json(foundComps);
        }
    });
});

//  search_criteria = {
//   name:this.entered_name,
//   surname:this.entered_surname,
//   nation:this.chosen_nation,
//   gender:this.chosen_gender,
//   sport:this.chosen_sport,
//   medal_winners:this.medal_winners //boolean
// }

router.route("/getAthletes").post((req, res) => {
    let search_object = new Object();
    if (req.body.name != "")
        Object.assign(search_object, { name: req.body.name });
    if (req.body.surname != "")
        Object.assign(search_object, { surname: req.body.surname });
    if (req.body.nation != "")
        Object.assign(search_object, { nation: req.body.nation });
    if (req.body.gender != "")
        Object.assign(search_object, { gender: req.body.gender });
    if (req.body.sport != "")
        Object.assign(search_object, { sport: req.body.sport });
    Object.assign(search_object, { medals: req.body.medal_winners });

    athlete.find(search_object, (err, foundAthletes) => {
        if (err)
            console.log(err);
        else {
            res.json(foundAthletes);
        }
    });

});


router.route("/register").post((req, res) => {
    user.findOne({ "username": req.body.username }, (err, foundUser) => {
        if (err) {
            console.log(err);
            res.json({ "message": "There was a problem with a server, please try again later." });
            return;
        }
        else if (foundUser) {
            res.json({ "message": "This username already exists, please try another one." });
            return;
        }
        else {
            request.findOne({ "username": req.body.username, "accepted": "pending" }, (err1, foundRequest) => {
                if (err1) {
                    console.log(err1);
                    res.json({ "message": "There was a problem with a server, please try again later." });
                    return;
                }
                else {
                    if (foundRequest) {
                        res.json({ "message": "The request for this username is already sent, and is waiting for approval" });
                        return;
                    }
                    else {
                        //delegate and leader
                        if (req.body.role == "leader") {
                            user.findOne({ "nation": req.body.nation, "role": "leader" }, (err2, foundLeader) => {
                                if (err2) {
                                    console.log(err2);
                                    res.json({ "message": "There was a problem with a server, please try again later." });
                                    return;
                                }
                                else {
                                    if (foundLeader) {
                                        res.json({ "message": "The national delegate leader already exists for this nation." });
                                        return;
                                    }
                                    else {
                                        request.collection.insertOne(req.body);
                                        res.json({
                                            "message": "Your registration is received. It should be accepted within 24 hours.",
                                            "additional_message": "If it is not, it means that someone else was accepted instead."
                                        });
                                        return;
                                    }
                                }
                            });
                        }
                        else {
                            request.collection.insertOne(req.body);
                            res.json({ "message": "Your registration is received. It should be accepted within 24 hours." });
                            return;
                        }
                    }
                }
            });
        }
    });
});

router.route("/pendingRequests").post((req, res) => {
    request.find({ "accepted": "pending" }, (err, foundRequests) => {
        if (err) {
            console.log(err);
        }
        else {
            if (foundRequests) {
                res.json(foundRequests);

            }
        }
    });
});


router.route("/confirmRequest").post((req, res) => {
    let user_object = {
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        password: req.body.password,
        nation: req.body.nation,
        email: req.body.email,
        role: req.body.role,
        delegated_competitions: new Array<Object>()
    };

    user.findOne({ "username": req.body.username }, (error, foundUser) => {
        if (error) {
            console.log(error);
        }
        else {
            if (foundUser) {
                //if already accepted request with that username, shouldn't happen by current
                //project state, but I still might change that, as there might be other people who want
                //the same username
                res.json({ "message": "A user with this username already exists" });
                return;
            }
            else {
                if (req.body.role == "leader") {
                    user.findOne({ "nation": req.body.nation, "role": "leader" }, (err2, foundLeader) => {
                        if (err2)
                            console.log(err2);
                        else {
                            if (foundLeader) {
                                res.json({ "message": "A national delegation leader for " + req.body.nation + " already exists." });
                                return;
                            }
                            else {
                                user.collection.insertOne(user_object, (err, returned) => {
                                    if (err) {
                                        console.log(err);

                                    }
                                    else {
                                        request.collection.updateOne({ "username": req.body.username }, { $set: { "accepted": "accepted" } }, () => {
                                            res.json({ "message": "You have successfully confirmed a account creating request for username " + req.body.username });
                                            return;
                                        });
                                    }
                                });
                            }
                        }
                    })
                }
                else {

                    user.collection.insertOne(user_object, (err, returned) => {
                        if (err) {
                            console.log(err);

                        }
                        else {
                            request.collection.updateOne({ "username": req.body.username }, { $set: { "accepted": "accepted" } }, () => {

                                res.json({ "message": "You have successfully confirmed a account creating request for username " + req.body.username });
                            });
                        }
                    });
                }
            }
        }
    });
});


router.route("/denyRequest").post((req, res) => {
    request.collection.updateOne({ "username": req.body.username, "accepted": "pending" }, { $set: { "accepted": "denied" } }, (err, updatedRequest) => {
        if (err)
            console.log(err);
        else {
            if (updatedRequest) {
                res.json({ "message": "You have successfully denied the request for username " + req.body.username + "." });
            }
            else {
                res.json({ "message": "The request for username " + req.body.username + " was already either accepted or denied" });
            }
        }
    });
});



app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));

