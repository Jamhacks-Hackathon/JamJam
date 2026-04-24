/*
File does not follow the proper naming conventions because of the JAMHacks website...
(Scott and Andrew do not value proper naming conventions)
*/
import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const userSchema = new Schema({
    discord_id: String,
    discord_username: {type: String, default: ''},
    name: {type: String, default: ''},
    first_name: {type: String, default: ''},
    last_name: {type: String, default: ''},
    email_discord: {type: String, default: ''},
    email: {type: String, default: ''},
    social_media_info: {
        linkedin: {
            type: String,
            default: '',
        },
        devpost: {
            type: String,
            default: '',
        },
        instagram: {
            type: String,
            default: '',
        },
        github: {
            type: String,
            default: '',
        },
        personal_website: {
            type: String,
            default: '',
        },
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    multiplier: {
        type: Number,
        default: 1,
    },
    isRegistered: {
        type: Boolean,
        default: false,
    },
    attendingStatus: {
        type: Number,
        default: 0,
    },
    applicantStatus: {
        type: Number,
        default: 0,
    },
    applicantRatings: {
        type: [{type: mongoose.Types.ObjectId, ref: 'ApplicantRating'}],
        default: [],
    },
    signedWaiver: {
        type: Boolean,
        default: false,
    },
    event_specific: {
        wistem_brunch: {
            type: Number,
            default: 0,
        },
        workshopAttendances: {
            type: [{type: mongoose.Types.ObjectId, ref: 'Events'}],
            default: [],
        },
        starredGoogleIds: {
            type: [String],
            default: [],
        },
    },
    resume: {type: String, default: ''},
    picture: {type: String, default: ''},
    waiver: {type: String, default: ''},
    hasBreakfast1: {type: Boolean, default: false},
    hasBreakfast2: {type: Boolean, default: false},
    hasLunch1: {type: Boolean, default: false},
    hasLunch2: {type: Boolean, default: false},
    hasDinner1: {type: Boolean, default: false},
    hasDinner2: {type: Boolean, default: false},
    chosen_accessory: {type: String, default: ''},
    chosen_balloon: {type: String, default: 'BalloonLogo.png'},
    phone_number: {type: String, default: ''},
    age: {type: Number, default: null},
    grade: {type: String, default: ''},
    grade_average: {type: String, default: ''},
    school: {type: String, default: ''},
    hackathons_count: {type: Number, default: null},
    gender: {type: String, default: ''},
    pronouns: {type: String, default: ''},
    race_ethnicity: {type: String, default: ''},
    address: {
        country: {type: String, default: ''},
        province: {type: String, default: ''},
        city: {type: String, default: ''},
        address: {type: String, default: ''},
        postal_code: {type: String, default: ''},
    },
    responses: {type: [String], default: ['', '', '']},
    wants_to_see: {type: String, default: ''},
    dietary_restrictions: {type: [String], default: []},
    dietary_other_details: {type: String, default: ''},
    t_shirt_size: {type: String, default: ''},
    interests: {type: [String], default: []},
    heard_about: {type: String, default: ''},
    mlh_marketing: {type: Boolean, default: false},
    sponsor_contact: {type: Boolean, default: false},
    hardware_taken_out: {
        type: [{
            hardware: {type: mongoose.Types.ObjectId, ref: 'Hardware'},
            quantity: {type: Number, default: 1},
            checkedOutAt: {type: Date, default: Date.now},
            returnedAt: {type: Date, default: null},
            checkedOutBy: {type: mongoose.Types.ObjectId, ref: 'Users'},
            checkoutGroupId: {type: String, default: ''},
        }],
        default: [],
    },
});

const USER = model('Users', userSchema);
export default USER;
