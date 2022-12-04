/* ===== PARAMETERS ==========
destinations = the name of the attribute that stores the total quantity
section = name of repeating fieldset, without the repeating_
fields = the name of the attribute field to be summed
      can be a single attribute: 'weight'
      or an array of attributes: ['weight','number','equipped']
extras: everything after the fields parameter is optional and can be in any order:
    'ceil'
    'round'
    'floor'
    'ceil: 3'
    'round: -2'
    'round: equipment_weight, equipment_cost|2
        you want to round the final total. 
        If you supply a field name, it will round just that total. You can supply multiple fields, separated by commas.
        If you supply a number, it will round to that many digits. 
        round:1 rounds to tenths; floor:-3 rounds down to thousands, so 3567 would be shown as 3000.
        If you dont supply a number, it assumes 0, and returns an integer (whole numbers).
        IMPORTANT: if you list ANY field, then ALL fields to be rounded must be specifically stated.
        Don't do this: floor:equipment_weight|2, round,
    
    'multiplier: 2'
    'multiplier:equipment_weight|2'
    'multiplier: equipment_weight|2, equipment_cost|3'
        Multiplier will apply a multiple to the final total. You can multiple all fields, or specific fields.
        It doesnt apply to attributes being added from outside the repeating section.
        Multiplier can be negative, representing a subtraction.

    'an_attribute'
    'an_attribute:-1'
    'an_attribute:0.5'
    'an_attribute:equipment_cost'
    'an_attribute:equipment_cost|-1'
    'an_attribute:equipment_cost|-1,equipment_weight|2'
        You can also list attributes from outside the repeating section. Don't try to add attributes from other repeating sections.
        by default, the listed attribute will be added to all fields.
        You can list one or more fields, and it will only be added to those fields.
        You can list a number: the attribute will be multiplied by that amount. So -1 subtracts the attribute.
*/
const repeatingSum = (destinations, section, fields) => {
    if (!Array.isArray(destinations)) destinations = [destinations.replace(/\s/g, '').split(',')];
    if (!Array.isArray(fields)) fields = [fields.replace(/\s/g, '').split(',')];
    getSectionIDs(`repeating_${section}`, idArray => {
        const attrArray = idArray.reduce((m, id) => [...m, ...(fields.map(field => `repeating_${section}_${id}_${field}`))], []);
        getAttrs([...attrArray], v => {
            const getValue = (section, id, field) => v[`repeating_${section}_${id}_${field}`] === 'on' ? 1 : parseFloat(v[`repeating_${section}_${id}_${field}`]) || 0;
            const commonMultipliers = (fields.length <= destinations.length) ? [] : fields.splice(destinations.length, fields.length - destinations.length);
            const output = {};
            destinations.forEach((destination, index) => {
                output[destination] = idArray.reduce((total, id) => total + getValue(section, id, fields[index]) * commonMultipliers.reduce((subtotal, mult) => subtotal * getValue(section, id, mult), 1), 0);
            });
            setAttrs(output);
        }); 
    }); 
};

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

/******************************************************************/
/****************************** TABS ******************************/
const buttonlist = ["wspolczynniki","umiejetnosci","inwentarz", "ekwipunek"];
buttonlist.forEach(button => {
    on(`clicked:${button}`, function() {
        setAttrs({
            sheetTab: button
        });
    });
});
/****************************** TABS ******************************/
/******************************************************************/
/******************************************************************/
/**************************** FIELDSETS ***************************/
on('change:repeating_injuries-general:injury_general_penalty remove:repeating_injuries-general', function() {
		repeatingSum("total_wounds_general","injuries-general","injury_general_penalty");
});
on('change:repeating_injuries-head:injury_head_penalty remove:repeating_injuries-head', function() {
		repeatingSum("total_wounds_head","injuries-head","injury_head_penalty");
});
on('change:repeating_injuries-torso:injury_torso_penalty remove:repeating_injuries-torso', function() {
		repeatingSum("total_wounds_torso","injuries-torso","injury_torso_penalty");
});
on('change:repeating_injuries-left-hand:injury_left_hand_penalty remove:repeating_injuries-left-hand', function() {
		repeatingSum("total_wounds_left_hand","injuries-left-hand","injury_left_hand_penalty");
});
on('change:repeating_injuries-left-foot:injury_left_foot_penalty remove:repeating_injuries-left-foot', function() {
		repeatingSum("total_wounds_left_foot","injuries-left-foot","injury_left_foot_penalty");
});
on('change:repeating_injuries-right-hand:injury_right_hand_penalty remove:repeating_injuries-right-hand', function() {
		repeatingSum("total_wounds_right_hand","injuries-right-hand","injury_right_hand_penalty");
});
on('change:repeating_injuries-right-foot:injury_right_foot_penalty remove:repeating_injuries-right-foot', function() {
		repeatingSum("total_wounds_right_foot","injuries-right-foot","injury_right_foot_penalty");
});

on('change:total_wounds_general change:total_wounds_head change:total_wounds_torso change:total_wounds_left_hand change:total_wounds_left_foot change:total_wounds_right_hand change:total_wounds_right_foot', function () {
	getAttrs(["total_wounds_general", "total_wounds_head", "total_wounds_torso", "total_wounds_left_hand", 
		"total_wounds_left_foot", "total_wounds_right_hand", "total_wounds_right_foot"], function(values) {
			let wounds =	parseInt(values.total_wounds_general||0) + 
							parseInt(values.total_wounds_head||0) + 
							parseInt(values.total_wounds_torso||0) + 
							parseInt(values.total_wounds_left_hand||0) +
							parseInt(values.total_wounds_left_foot||0) +
							parseInt(values.total_wounds_right_hand||0) +
							parseInt(values.total_wounds_right_foot||0);
			setAttrs({"total_wounds":wounds});
		});
});


on('change:repeating_injuries-general:injury_general_type remove:repeating_injuries-general', function() {
		repeatingSum("total_damage_general","injuries-general","injury_general_type");
});
on('change:repeating_injuries-head:injury_head_type remove:repeating_injuries-head', function() {
		repeatingSum("total_damage_head","injuries-head","injury_head_type");
});
on('change:repeating_injuries-torso:injury_torso_type remove:repeating_injuries-torso', function() {
		repeatingSum("total_damage_torso","injuries-torso","injury_torso_type");
});
on('change:repeating_injuries-left-hand:injury_left_hand_type remove:repeating_injuries-left-hand', function() {
		repeatingSum("total_damage_left_hand","injuries-left-hand","injury_left_hand_type");
});
on('change:repeating_injuries-left-foot:injury_left_foot_type remove:repeating_injuries-left-foot', function() {
		repeatingSum("total_damage_left_foot","injuries-left-foot","injury_left_foot_type");
});
on('change:repeating_injuries-right-hand:injury_right_hand_type remove:repeating_injuries-right-hand', function() {
		repeatingSum("total_damage_right_hand","injuries-right-hand","injury_right_hand_type");
});
on('change:repeating_injuries-right-foot:injury_right_foot_type remove:repeating_injuries-right-foot', function() {
		repeatingSum("total_damage_right_foot","injuries-right-foot","injury_right_foot_type");
});
on('change:total_damage_general change:total_damage_head change:total_damage_torso change:total_damage_left_hand change:total_damage_left_foot change:total_damage_right_hand change:total_damage_right_foot', function () {
	getAttrs(["total_damage_general", "total_damage_head", "total_damage_torso", "total_damage_left_hand",
		"total_damage_left_foot", "total_damage_right_hand", "total_damage_right_foot"], function(values) {
			let damage = 	parseInt(values.total_damage_general||0) + 
							parseInt(values.total_damage_head||0) + 
							parseInt(values.total_damage_torso||0) + 
							parseInt(values.total_damage_left_hand||0) +
							parseInt(values.total_damage_left_foot||0) +
							parseInt(values.total_damage_right_hand||0) +
							parseInt(values.total_damage_right_foot||0);
			setAttrs({"total_damage":damage});
		});
});

/**************************** FIELDSETS ***************************/
/******************************************************************/

/******************************************************************/
/******************* BASE STATS / WSPÓŁCZYNNIKI *******************/
on("change:zrecznosc_base change:mod_zrecznosc change:percepcja_base change:mod_percepcja change:charakter_base change:mod_charakter change:spryt_base change:mod_spryt change:budowa_base change:mod_budowa sheet:opened", function() {  
  getAttrs([	"zrecznosc_base","mod_zrecznosc", 
				"percepcja_base","mod_percepcja",
				"charakter_base","mod_charakter",
				"spryt_base","mod_spryt",
				"budowa_base", "mod_budowa"], function(values) {
    let zr_b = clamp((parseInt(values.zrecznosc_base)||0), 1, 40);
    let pc_b = clamp((parseInt(values.percepcja_base)||0), 1, 40);
    let ch_b = clamp((parseInt(values.charakter_base)||0), 1, 40);
    let sp_b = clamp((parseInt(values.spryt_base)||0), 1, 40);
    let bd_b = clamp((parseInt(values.budowa_base)||0), 1, 40);

    let zr =  zr_b + (parseInt(values.mod_zrecznosc)||0);
    let pc =  pc_b + (parseInt(values.mod_percepcja)||0);
	let ch =  ch_b + (parseInt(values.mod_charakter)||0);
    let sp =  sp_b + (parseInt(values.mod_spryt)||0);
	let bd =  bd_b + (parseInt(values.mod_budowa)||0);
    setAttrs({                            
      "zr_df_0": zr+2,
	  "pc_df_0": pc+2,
	  "ch_df_0": ch+2,
	  "sp_df_0": sp+2,
	  "bd_df_0": bd+2,
	  
	  "zr_df_1": zr,
	  "pc_df_1": pc,
	  "ch_df_1": ch,
	  "sp_df_1": sp,
	  "bd_df_1": bd,
	  
      "zrecznosc_base": zr_b,
      "percepcja_base": pc_b,
      "charakter_base": ch_b,
      "spryt_base": sp_b,
      "budowa_base": bd_b,

	  "zrecznosc": zr,
	  "percepcja": pc,
	  "charakter": ch,
	  "spryt": sp,
	  "budowa": bd,
	  
	  "zr_df_2": zr-2,
	  "pc_df_2": pc-2,
	  "ch_df_2": ch-2,
	  "sp_df_2": sp-2,
	  "bd_df_2": bd-2,
	  
	  "zr_df_3": zr-5,
	  "pc_df_3": pc-5,
	  "ch_df_3": ch-5,
	  "sp_df_3": sp-5,
	  "bd_df_3": bd-5,
	  
	  "zr_df_4": zr-8,
	  "pc_df_4": pc-8,
	  "ch_df_4": ch-8,
	  "sp_df_4": sp-8,
	  "bd_df_4": bd-8,
	  
	  "zr_df_5": zr-11,
	  "pc_df_5": pc-11,
	  "ch_df_5": ch-11,
	  "sp_df_5": sp-11,
	  "bd_df_5": bd-11,
	  
	  "zr_df_6": zr-15,
	  "pc_df_6": pc-15,
	  "ch_df_6": ch-15,
	  "sp_df_6": sp-15,
	  "bd_df_6": bd-15,
    });
  });
});
/******************* BASE STATS / WSPÓŁCZYNNIKI *******************/
/******************************************************************/
/******************************************************************/
/************************** ROLL PARAMETERS ***********************/

const HAND_LEFT = "left";
const HAND_RIGHT = "right";
const HAND_NONE = "none";

const difficulties = [-2,0,2,5,8,11,15, 20, 24];
const startingPercent = [-20, 0, 11, 31, 61, 91, 121, 201, 241];
const lastPassingPercent = [-1,10,30,60,90,120,200, 240, 0xFFFFFF];
const levelRadioValues = ["0","1","2","3","4","5","6","7","8"];
const levelLabels = ["Łatwy", "Przeciętny", "Problematyczny", "Trudny", "Bardzo Trudny", "Cholernie Trudny", "Fart", "Mistrzowski", "Arcymistrzowski"];
const levelLabelsGenitive = ["Łatwego", "Przeciętnego", "Problematycznego", "Trudnego", "Bardzo Trudnego", "Cholernie Trudnego", "Fartownego", "Mistrzowskiego", "Arcymistrzowskiego"];
  levelRadioValues.forEach(function(value) {
    on(`clicked:level_${value}`, function() {
      setAttrs({
        ["level"]: value
      });
    });
});

on("change:level change:modi_battle change:modi_open change:modi_penalties change:total_wounds change:modi_armor_penalties change:total_armor_penalties change:modi_encumberace_penalties change:encumberace_penalties change:modi_distance_penalty change:weapon_attack_penalty change:modi_inaccuracy_penalty change:inaccuracy_penalty change:modi_custom_penalty change:custom_penalty ", function() {  
    getAttrs([	"level", 
    "modi_battle","modi_open", 
    "modi_penalties","total_wounds", 
    "modi_armor_penalties","total_armor_penalties", 
    "modi_encumberace_penalties", "encumberace_penalties", 
    "modi_distance_penalty", "weapon_attack_penalty", 
    "modi_inaccuracy_penalty", "inaccuracy_penalty",
    "custom_penalty", "modi_custom_penalty", 
    "selectedWeaponHand"], function(values) {
        let level = ((parseInt(values.level))||0);
        let modi_penalties = (parseInt(values.modi_penalties)||0);
        let total_wounds = (parseInt(values.total_wounds)||0);
        let modi_armor_penalties = (parseInt(values.modi_armor_penalties)||0);
        let total_armor_penalties = (parseInt(values.total_armor_penalties)||0);
        
        let modi_battle = (parseInt(values.modi_battle)||0);
        let modi_open = (parseInt(values.modi_open)||0);
        let modi_encumberace_penalties = (parseInt(values.modi_encumberace_penalties)||0);
        let encumberace_penalties = (parseInt(values.encumberace_penalties)||0);
        let modi_distance_penalty = (parseInt(values.modi_distance_penalty)||0);
        let distance_penalty = (parseInt(values.weapon_attack_penalty)||0);
        let modi_inaccuracy_penalty = (parseInt(values.modi_inaccuracy_penalty)||0);
        let inaccuracy_penalty_value = (parseInt(values.inaccuracy_penalty)||0);
        let modi_custom_penalty = (parseInt(values.modi_custom_penalty)||0);
        let custom_penalty = (parseInt(values.custom_penalty)||0);

        let selectedWeaponHand = String(values.selectedWeaponHand);

        let final_test_penalty =(   startingPercent[level] + 
                                    ( modi_penalties ? total_wounds : 0 ) +
                                    ( modi_armor_penalties ? total_armor_penalties: 0 ) +
                                    ( modi_encumberace_penalties ? encumberace_penalties : 0 ) +
                                    ( modi_distance_penalty ? distance_penalty : 0 ) +
                                    ( modi_inaccuracy_penalty ? inaccuracy_penalty_value : 0 ) +
                                    ( modi_custom_penalty ? custom_penalty : 0 )
                                );
        let final_test_level = 0;
        while( final_test_penalty > lastPassingPercent[final_test_level] ) {
            final_test_level++;
            if(final_test_level >= lastPassingPercent.length ) {
                final_test_level = (lastPassingPercent.length - 1);
                break;
            }
        }
        let final_test_level_label = levelLabels[final_test_level];

        let dictionary = {
            "final_test_level": final_test_level,
            "final_test_penalty": final_test_penalty,
            "final_test_level_display": final_test_level_label
        };

        if( modi_battle && modi_open ) {
            // Can't have an open combat test
            // Break tie with whether a weapon is in hand
            if( selectedWeaponHand != HAND_NONE ) {
                // Assume prior mode was combat
                dictionary["modi_battle"]   = 1;
                dictionary["modi_open"]     = 0;
            } else {
                // Assume prior mode was non-combat
                dictionary["modi_battle"]   = 0;
                dictionary["modi_open"]     = 1;
            }
        }
        if( modi_battle ) {
            if( selectedWeaponHand == HAND_NONE ) {
                // Use right hand weapon by default
                setWeaponSkillsSheet(HAND_RIGHT);
            }
        } else {
            // Lower weapon if holding one
            setWeaponSkillsSheet(HAND_NONE);
        }
        setAttrs(dictionary);
    });
});
/************************** ROLL PARAMETERS ***********************/
/******************************************************************/
/******************************************************************/
/*************************** ROLL HANDLERS ************************/
const wsplist = [
    "zrecznosc",
    "percepcja",
    "charakter",
    "spryt",
    "budowa"
];

const W_ZR = "zrecznosc";
const W_PC = "percepcja";
const W_CH = "charakter";
const W_SP = "spryt";
const W_BD = "budowa";

const wsp2accusative = {
    "zrecznosc":"zręczność",
    "percepcja":"percepcję",
    "charakter":"charakter",
    "spryt":"spryt",
    "budowa":"budowę"
};

const statslist = [
    "bijatyka",                         "bron_reczna",                  "rzucanie", 
    "pistolety",                        "karabiny",                     "bron_maszynowa",
    "luk",                              "kusza",                        "proca",
    "samochod",                         "ciezarowka",                   "motocykl",
    "kradziez_kieszonkowa",             "zwinne_dlonie",                "otwieranie_zamkow",
    
    "wyczucie_kierunku",                "tropienie",                    "przygotowanie_pulapki",
    "nasluchiwanie",                    "wypatrywanie",                 "czujnosc",
    "skradanie_sie",                    "ukrywanie_sie",                "maskowanie",
    "lowiectwo",                        "zdobywanie_wody",              "znajomosc_terenu",
    
    "perswazja",                        "zastraszanie",                 "zdolnosci_przywodcze",     
    "postrzeganie_emocji",              "blef",                         "opieka_nad_zwierzetami",
    "odpornosc_na_bol",                 "niezlomnosc",                  "morale",
    
    "leczenie_ran",                     "leczenie_chorob",              "pierwsza_pomoc",
    "mechanika",                        "elektronika",                  "komputery",
    "maszyny_ciezkie",                  "wozy_bojowe",                  "kutry",
    "rusznikarstwo",                    "wyrzutnie",                    "materialy_wybuchowe",
    "wogl0",                            "wogl1",                        "wogl2",
    "wogl3",                            "wogl4",                        "wogl5",
    
    "plywanie",                         "wspinaczka",                   "kondycja",
    "jazda_konna",                      "powozenie",                    "ujezdzanie"
];

const stats2wsp = {
    "bijatyka" : W_ZR,                  "bron_reczna":W_ZR,             "rzucanie":W_ZR,
    "pistolety":W_ZR,                   "karabiny": "zrecznosc",        "bron_maszynowa":W_ZR,
    "luk":W_ZR,                         "kusza":W_ZR,                   "proca":W_ZR,
    "samochod":W_ZR,                    "ciezarowka":W_ZR,              "motocykl":W_ZR,
    "kradziez_kieszonkowa":W_ZR,        "zwinne_dlonie":W_ZR,           "otwieranie_zamkow":W_ZR,
    
    "wyczucie_kierunku":W_PC,           "tropienie":W_PC,               "przygotowanie_pulapki":W_PC,
    "nasluchiwanie":W_PC,               "wypatrywanie":W_PC,            "czujnosc":W_PC,
    "skradanie_sie":W_PC,               "ukrywanie_sie":W_PC,           "maskowanie":W_PC,
    "lowiectwo":W_PC,                   "zdobywanie_wody":W_PC,         "znajomosc_terenu":W_PC,
    
    "perswazja":W_CH,                   "zastraszanie":W_CH,            "zdolnosci_przywodcze":W_CH,     
    "postrzeganie_emocji":W_CH,         "blef":W_CH,                    "opieka_nad_zwierzetami":W_CH,
    "odpornosc_na_bol":W_CH,            "niezlomnosc":W_CH,             "morale":W_CH,
    
    "leczenie_ran":W_SP,                "leczenie_chorob":W_SP,         "pierwsza_pomoc":W_SP,
    "mechanika":W_SP,                   "elektronika":W_SP,             "komputery":W_SP,
    "maszyny_ciezkie":W_SP,             "wozy_bojowe":W_SP,             "kutry":W_SP,
    "rusznikarstwo":W_SP,               "wyrzutnie":W_SP,               "materialy_wybuchowe":W_SP,
    "wogl0":W_SP,                       "wogl1":W_SP,                   "wogl2":W_SP,   
    "wogl3":W_SP,                       "wogl4":W_SP,                   "wogl5":W_SP,   
    
    "plywanie":W_BD,                    "wspinaczka":W_BD,              "kondycja":W_BD,
    "jazda_konna":W_BD,                 "powozenie":W_BD,               "ujezdzanie":W_BD
};

stats2genitive = {
    "bijatyka":"bijatyki",                              "bron_reczna":"walki bronią białą",                 "rzucanie":"rzucania",
    "pistolety":"strzelania z broni krótkiej",          "karabiny":"strzelania z broni długiej",            "bron_maszynowa":"strzelania z broni maszynowej",
    "luk":"łucznictwa",                                 "kusza":"kusznictwa",                               "proca":"procarstwa",
    "samochod":"prowadzenia samochodu",                 "ciezarowka":"prowadzenia samochodu ciężarowego",   "motocykl":"prowadzenia motocyklu",
    "kradziez_kieszonkowa":"kradzieży kieszonkowej",    "zwinne_dlonie":"zwinnych dłoni",                   "otwieranie_zamkow":"otwierania zamków",

    "wyczucie_kierunku":"wyczucia kierunku",            "tropienie":"tropienia",                            "przygotowanie_pulapki":"przygotowania pułapki",
    "nasluchiwanie":"nasłuchiwania",                    "wypatrywanie":"wypatrywania",                      "czujnosc":"czujności",
    "skradanie_sie":"skradania się",                    "ukrywanie_sie":"ukrywania się",                    "maskowanie":"maskowania",
    "lowiectwo":"łowiectwa",                            "zdobywanie_wody":"zdobywania wody",                "znajomosc_terenu":"znajomości terenu",

    "perswazja":"persfazji",                            "zastraszanie":"zastraszania",                      "zdolnosci_przywodcze":"zdolności przywódczych",
    "postrzeganie_emocji":"postrzegania emocji",        "blef":"blefu",                                     "opieka_nad_zwierzetami":"opieki nad zwierzętami",
    "odpornosc_na_bol":"odporności na ból",             "niezlomnosc":"niezłomności",                       "morale":"morale",

    "leczenie_ran":"leczenia ran",                      "leczenie_chorob":"leczenia chorób",                "pierwsza_pomoc":"pierwszej pomocy",
    "mechanika":"mechaniki",                            "elektronika":"elektroniki",                        "komputery":"komputerów",
    "maszyny_ciezkie":"znajomości maszyn ciężkich",     "wozy_bojowe":"prowadzenia wozów bojowych",         "kutry":"sterowania kutrem",
    "rusznikarstwo":"rusznikarstwa",                    "wyrzutnie":"obsługi wyrzutni",                     "materialy_wybuchowe":"znajomości materiałów wybuchowych",
    "wogl0":"UNSET",                                    "wogl1":"UNSET",                                    "wogl2":"UNSET",
    "wogl3":"UNSET",                                    "wogl4":"UNSET",                                    "wogl5":"UNSET",

    "plywanie":"pływania",                              "wspinaczka":"wspinaczki",                          "kondycja":"kondycji",
    "jazda_konna":"jeździectwa",                        "powozenie":"powożenia",                            "ujezdzanie":"ujeżdżania",
}

const wogl_labels = [
    "wogl0_label", "wogl1_label", "wogl2_label", "wogl3_label", "wogl4_label", "wogl5_label"
];
wogl_labels.forEach((label) => {
    on(`change:${label} remove:${label} sheet:opened`, () => {
        getAttrs([label], (values) => {
            let skillid = label.split("_")[0];
            let skillname = String(values[label]);
            skillname = skillname.length > 0 ? skillname : "niewiedzy";
            stats2genitive[skillid] = `wiedzy ogólnej (${skillname})`;
        });
    });
});

const ROLL_MODE_NON_COMBAT = "non-combat";
const ROLL_MODE_COMBAT_RANGED_SINGLE = "combat-ranged-single";
const ROLL_MODE_COMBAT_RANGED_RAPID = "combat-ranged-rapid";
const ROLL_MODE_COMBAT_RANGED_MISFIRE = "combat-ranged-misfire";
const ROLL_MODE_COMBAT_MELEE = "combat-melee";

function umiejetnoscHandler(wspname, skillname, info) {
    let skillBased = (skillname !== null);
    let query = ["level", "final_test_level",  "selectedWeaponHand", 
    "inv_hand_left_name", "inv_hand_left_type", "inv_hand_left_id",
    "inv_hand_right_name", "inv_hand_right_type", "inv_hand_right_id", 
    "selected_weapon_ranged_fire_button", "final_test_level_display", "final_test_penalty", 
    "modi_battle", "modi_open", 
    "modi_penalties", "total_wounds", 
    "modi_armor_penalties", "total_armor_penalties",
    "modi_encumberace_penalties", "encumberace_penalties",
    "modi_inaccuracy_penalty", "inaccuracy_penalty",
    "modi_distance_penalty", "weapon_attack_penalty",
    "modi_custom_penalty", "custom_penalty",
    wspname];
    if( skillBased ) {
        query.push(skillname)
    }
    log(`Query: ${query}`);
    getAttrs(query, function(values) {
        // Penalty configuration
        let modi_battle = (parseInt(values.modi_battle)||0);
        let modi_open = (parseInt(values.modi_open)||0);
        let modi_wound_penalty = (parseInt(values.modi_penalties)||0);
        let wound_penalty_value = (parseInt(values.total_wounds)||0);
        let modi_armor_penalty = (parseInt(values.modi_armor_penalties)||0);
        let armor_penalty_value = (parseInt(values.total_armor_penalties)||0);
        let modi_encumberace_penalty = (parseInt(values.modi_encumberace_penalties)||0);
        let encumberance_penalty_value = (parseInt(values.encumberace_penalties)||0);
        let modi_distance_penalty = (parseInt(values.modi_distance_penalty)||0);
        let distance_penalty_value = (parseInt(values.weapon_attack_penalty)||0);
        let modi_inaccuracy_penalty = (parseInt(values.modi_inaccuracy_penalty)||0);
        let inaccuracy_penalty_value = (parseInt(values.inaccuracy_penalty)||0);
        let modi_custom_penalty = (parseInt(values.modi_custom_penalty)||0);
        let custom_penalty_value = (parseInt(values.custom_penalty)||0);

        // Common
        let wsp_name = wsp2accusative[wspname];
        let statbase = (parseInt(values[wspname])||0);
        let level_base = (parseInt(values.level)||0);
        let levelLabel = levelLabels[level_base];
        let final_test_level = (parseInt(values.final_test_level)||0);
        let default_test_value =  statbase - difficulties[final_test_level];
        let final_test_penalty = (parseInt(values.final_test_penalty)||0) - startingPercent[level_base];
        let rollMode = ROLL_MODE_NON_COMBAT;
        let dice_count = 3;
        let skillstring = ( modi_open ? "otwarty " : "zamknięty " )
        let penalty_string = "";
        let penalty_sum_string = "";

        // Skill-specific
        let skill = 0;
        let skill_remaining = 0;
        let skillvalue = "";
        if( skillBased ) {
            skillstring += stats2genitive[skillname];
            skill = (parseInt(values[skillname])||0);
            skill_remaining = skill;
            skillvalue = `(${skill})`;
        }
        
        // Inventory
        let selected_hand = String(values.selectedWeaponHand);
        let selected_weapon_ranged_fire_button = (parseInt(values.selected_weapon_ranged_fire_button)||-1);
        let selected_hand_name = "";
        let selected_hand_type = "";
        switch(selected_hand) {
            case HAND_LEFT:
                selected_hand_name = String(values.inv_hand_left_name);
                selected_hand_type = String(values.inv_hand_left_type);
                selected_hand_id = String(values.inv_hand_left_id);
            case HAND_RIGHT:
                selected_hand_name = String(values.inv_hand_right_name);
                selected_hand_type = String(values.inv_hand_right_type);
                selected_hand_id = String(values.inv_hand_right_id);
                break;
            default:
                selected_hand = HAND_NONE;
        }

        // Build penalty string
        if( final_test_penalty != 0) {
            if( modi_wound_penalty && wound_penalty_value != 0 ) {
                penalty_string += `Rany:${wound_penalty_value}% `;
            }
            if( modi_armor_penalty && armor_penalty_value != 0 ) {
                penalty_string += `Pancerz:${armor_penalty_value}% `;
            }
            if( modi_encumberace_penalty && encumberance_penalty_value != 0 ) {
                penalty_string += `Obciążenie:${encumberance_penalty_value}% `;
            }
            if( modi_distance_penalty && distance_penalty_value != 0 ) {
                penalty_string += `Dystans:${distance_penalty_value}% `;
            }
            if( modi_inaccuracy_penalty && inaccuracy_penalty_value != 0 ) {
                penalty_string += `${(inaccuracy_penalty_value > 0 ? "Niecelność":"Celność")}:${inaccuracy_penalty_value}% `;
            }
            if( modi_custom_penalty && custom_penalty_value != 0 ) {
                penalty_string += `${(custom_penalty_value > 0 ? "Utrudnienie":"Ułatwienie")}:${custom_penalty_value}% `;
            }
            penalty_sum_string = `Suma kar:${final_test_penalty}% `;
        }

        // Determine and describe roll mode
        if( !modi_battle ){
            if( skillBased ){
                // Slider - no skill means test is harder by 1 level. Git gud.
                let advantage = skill ? parseInt(skill/4) : -1; 
                final_test_level -= advantage;
                if( advantage != 0 ) {
                    penalty_sum_string += `Suwak:${advantage}`;
                }
            }
        } else {
            skillstring = "bojowy "+skillstring
            switch(selected_hand) {
                case HAND_LEFT:
                case HAND_RIGHT:
                    switch(selected_hand_type) {
                        case WEAPON_TYPE_RANGED:
                            switch(selected_weapon_ranged_fire_button) {
                                case 3:
                                case 2:
                                case 1:
                                    dice_count = selected_weapon_ranged_fire_button;
                                    rollMode = ROLL_MODE_COMBAT_RANGED_SINGLE;
                                    break;
                                case 4:
                                case 5:
                                case 6:
                                    let segments = selected_weapon_ranged_fire_button - 3;
                                    dice_count = 1;
                                    rollMode = ROLL_MODE_COMBAT_RANGED_RAPID;
                                    break;
                                case -1:
                                default:
                                    log(`Invalid fire mode button selection - ${selected_weapon_ranged_fire_button}`)
                                    return;
                            }
                            break;

                        case WEAPON_TYPE_MELEE:
                            rollMode = ROLL_MODE_COMBAT_RANGED_RAPID;
                            break;

                        case WEAPON_TYPE_NONE:
                        default:
                            dice_count = 3;
                            rollMode = ROLL_MODE_NON_COMBAT;
                    }
                    break;

                case HAND_NONE:
                default:
                    dice_count = 3;
                    rollMode = ROLL_MODE_NON_COMBAT;
            } 
        }

        let rstr = `&{template:${rollMode}} {{successes=[[0[computed value]]]}} {{finaldifficultylabel=[[0[computed value]]]}} {{passingvalue=[[0[computed value]]]}} `;
        // Create string with appropriate number of dice rolls
        for(let i = 0; i<dice_count; ++i) {
            rstr += `{{roll${i+1}=[[1d20]]}} `;
        }
        rstr += `{{base_wsp_name=${wsp_name}}} {{wsp_val=${statbase}}} {{skill-name=${skillstring}}} {{skillval=${skillvalue}}} `
        rstr += `{{modi-open=[[${modi_open}]]}} {{penalties_sum_str=${penalty_sum_string}}} {{penalties_str=${penalty_string}}} {{dice_count=[[${dice_count}]]}}`;
        
        
        switch(rollMode){    
            case ROLL_MODE_COMBAT_RANGED_SINGLE:
                // Get additional params relevant for combat derived from 1st order params
                let selected_hand_misfire = selected_hand_id.replace("_line", "_misfire");
                getAttrs([selected_hand_misfire], (values_combat) => {
                    let misfireWeapon = (parseInt(values_combat[selected_hand_misfire])||0);
                    rstr += ` {{rollz=[[1d20]]}} {{weapon_name=${selected_hand_name}}} {{misfire_value=${misfireWeapon}}} {{penalties_str=${penalty_string}}}`;
                    log(`Roll string: ${rstr}`);
                    startRoll(rstr, (results) => {
                        let x = 0;
                        let vals = [];
                        let misfireRoll = results.results.rollz.result;
                        

                        for(x=0; x<dice_count; ++x) {
                            vals.push(results.results[`roll${x+1}`].result);
                        }
                        
                        let dice_style = Array(dice_count).fill(4);
                        let vals_s = vals.concat().sort( function(a, b){return a-b} );
                        let success_count = 0;
                        for (x=0; x<dice_count; ++x) {
                            if(vals_s[x] <= default_test_value) {
                                success_count += 1;
                                dice_style[x] = 0;
                            } else {
                                if ( vals_s[x] - skill <= default_test_value && default_test_value > 0 ) {
                                    success_count += 1;
                                    dice_style[x] = 1;
                                } else {
                                    dice_style[x] = 2;
                                }
                            }
                            if(modi_battle) {
                                if(vals_s[x]==20 && dice_style[x] != 2) {
                                    // Pechowa 20-tka
                                    dice_style[x] = 2;
                                    success_count -= 1;
                                }
                            }
                        }
                        let dice_unsort = Array(dice_count).fill(4);
                        for(x=0; x<dice_count; ++x) {
                            for(let y=0; y<dice_count; ++y) {
                                if(vals[x]==vals_s[y]) {
                                    dice_unsort[x] = dice_style[y];
                                    vals_s[y] = -1;
                                    break;
                                }
                            }
                        }
                        let rollResult = {
                            successes : success_count,
                        };
                        for(x=0; x<dice_count; ++x) {
                            rollResult[`roll${x+1}`] = dice_unsort[x];
                            log(`Roll ${x+1} = ${dice_unsort[x]}`)
                            log(`Roll val${x}:${vals[x]}`);
                        }
                        
                         // Misfire logic - can make the entire test fail
                         if( misfireWeapon != 0 ) {
                            if( misfireRoll >= misfireWeapon) {
                                rollResult["rollz"] = 2;
                                for(x=0; x<dice_count; ++x) {
                                    rollResult[`roll${x+1}`] = 4;
                                }
                            } else {
                                rollResult["rollz"] = 0;
                            }
                        } else {
                            rollResult["rollz"] = 4;
                        }
                        
                        finishRoll(results.rollId, rollResult);    
                    });
                });
                break;

            case ROLL_MODE_NON_COMBAT:
                log(`Roll string: ${rstr}`);
                startRoll(rstr, (results) => {
                    const vals = [results.results.roll1.result, results.results.roll2.result, results.results.roll3.result];
                    let x = 0;
                    
                    // 1 / 20 rolls +1/-1 difficulty
                    if( !modi_battle ){
                        // Critical rolls ( 1 / 20 )
                        for (x=0; x<3; ++x) {
                            if(vals[x]==1)
                            { 
                                final_test_level -= 1;
                            }
                            if(vals[x]==20)
                            {
                                final_test_level += 1;
                            }
                        }
                    }
                    final_test_level = final_test_level < 0 ? 0 : (final_test_level > 8 ? 8 : final_test_level);

                    // Successes and failures
                    let dice_style = [3,3,3];
                    let vals_s = vals.concat().sort(function(a, b){return a-b});
                    let statreq = statbase - difficulties[final_test_level];
                    let succ = 0;
                    if (modi_open) {
                        let vals_sc = vals_s.concat();
                        // Skills flow
                        if( skillBased ) {
                            while ( skill_remaining > 0 ) {
                                if (vals_sc[0] == vals_sc[1]) {
                                    vals_sc[0] -= 1;
                                } else {
                                    vals_sc[1] -= 1;
                                }
                                skill_remaining -= 1;
                            }
                            vals_sc[1] = vals_sc[1] < 1 ? 1 : vals_sc[1];
                        }
                        
                        // Skills + wsp flow
                        succ = statreq - vals_sc[1];
                        if( succ>=0 ) {
                            dice_style[1] = 0;
                        } else {
                            dice_style[1] = 2;
                        }
                    } else {
                        for (x=0; x<3; ++x) {
                            if(vals_s[x] <= statreq) {
                                succ += 1;
                                dice_style[x] = 0;
                            } else {
                                if ( vals_s[x] - skill_remaining <= statreq && statreq > 0 ) {
                                    skill_remaining -= (vals_s[x] - statreq);
                                    succ += 1;
                                    dice_style[x] = 1;
                                } else {
                                    dice_style[x] = 2;
                                }
                                if(modi_battle) {
                                    if(vals_s[x]==20 && dice_style[x] != 2) {
                                        // Pechowa 20-tka
                                        dice_style[x] = 2;
                                        success_count -= 1;
                                    }
                                }
                            }
                        }    
                    }

                    let dice_unsort = [3,3,3];
                        for(x=0; x<3; ++x) {
                            for(let y=0; y<3; ++y) {
                                if(vals[x]==vals_s[y]) {
                                    dice_unsort[x] = dice_style[y];
                                    vals_s[y] = -1;
                                    vals[x] = 0;
                                    break;
                                }
                            }
                        }
                    
                    // Clamp level
                    final_test_level = final_test_level > levelLabels.length ? levelLabels.length - 1 : final_test_level;
                    final_test_level = final_test_level < 0 ? 0 : final_test_level;
                    let prev_difficulty = level_base == final_test_level ? "" : "(z "+levelLabelsGenitive[level_base]+")";
                    let label = levelLabels[final_test_level]+prev_difficulty;

                    finishRoll(
                        results.rollId,
                        {
                            roll1: dice_unsort[0],
                            roll2: dice_unsort[1],
                            roll3: dice_unsort[2],
                            finaldifficultylabel: label,
                            successes : succ,
                            passingvalue: statreq
                        }
                    );
                });
                break;
        }
    });
}

statslist.forEach((skillname) => {
    on(`change:${skillname}`, () => {
        getAttrs([skillname], (values) => {
            let statval = (parseInt(values[skillname])||0);
            statval = clamp(statval, 0, 20);
            let dictionary = {};
            dictionary[skillname] = statval;
            setAttrs(dictionary);
        });
    });

    on(`clicked:test_${skillname}`, (info) => {
        let wspname = stats2wsp[skillname];
        umiejetnoscHandler(wspname, skillname, info);
    });
});

wsplist.forEach((wspname) => {
    on(`clicked:test_${wspname}`, (info) => {
        umiejetnoscHandler(wspname, null, info);
    });
});

// Register the click handler to all specified buttons.
const toggleList = [
    "grp_walka_wrecz", 
    "grp_bron_strzelecka",
    "grp_bron-dystansowa",
    "grp_prowadzenie-pojazdow",
    "grp_zdolnosci-manualne",
    "grp_orientacja-w-terenie",
    "grp_spostrzegawczosc",
    "grp_kamuflaz",
    "grp_przetrwanie",
    "grp_negocjacje",
    "grp_empatia",
    "grp_sila-woli",
    "grp_medycyna",
    "grp_technika",
    "grp_sprzet",
    "grp_pirotechnika",
    "grp_wiedza-ogolna-1",
    "grp_wiedza-ogolna-2",
    "grp_sprawnosc",
    "grp_jezdziectwo",
];

const spec2grp = [
    // Technik
    [
        "grp_prowadzenie-pojazdow",
        "grp_medycyna",
        "grp_technika",
        "grp_wiedza-ogolna-1",
        "grp_sprzet",
        "grp_pirotechnika",
    ],
    // Wojownik
    [
        "grp_walka_wrecz", 
        "grp_bron_strzelecka",
        "grp_bron-dystansowa",
        "grp_sila-woli",
        "grp_pirotechnika",
    ],
    // Ranger
    [
        "grp_sprawnosc",
        "grp_jezdziectwo",
        "grp_bron-dystansowa",
        "grp_medycyna",
        "grp_orientacja-w-terenie",
        "grp_spostrzegawczosc",
        "grp_kamuflaz",
        "grp_przetrwanie",
    ],
    // Cwaniak
    [
        "grp_zdolnosci-manualne",
        "grp_negocjacje",
        "grp_empatia",
        "grp_kamuflaz",
    ],
    // Brak (Hibernatus)
    []
];

toggleList.forEach(function(button) {
  on(`clicked:${button}`, function() {
    const flag = `${button}_flag`;
    // Check the current value of the hidden flag.
    getAttrs([flag], function(v) {
      // Update the value of the hidden flag to "1" for checked or "0" for unchecked.
      setAttrs({
        [flag]: v[flag] !== "1" ? "1" : "0"
      });
    });
  });
});

on("change:specjalizacja", function() {
    getAttrs(["specjalizacja"], function(v) {
        const grpid = clamp((parseInt(v.specjalizacja)||0), 0, 4);
        const specgroups = spec2grp[grpid];
        let dictionary = {};
        for (const group of toggleList) {
            const flag = `${group}_flag`;
            let in_group = "0";
            for (const sgroup of specgroups) {
                if(sgroup == group) {
                    in_group = "1";
                    break;
                }
            }
            dictionary[flag] = in_group;
        }
        setAttrs(dictionary);
    });
});
/*************************** ROLL HANDLERS ************************/
/******************************************************************/

/******************************************************************/
/*************************** EKWIPUNEK ****************************/
const UNEQUIP_NAME = "Pięść";
const UNEQUIP_ID = "";
const WEAPON_TYPE_RANGED = "ranged";
const WEAPON_TYPE_MELEE = "melee";
const WEAPON_TYPE_NONE = "none";

// Big thanks to Riernar for this recursive magic!
function generate_unequip_dictionary(tgtline, line_id, name_qualifier_pairs, callback) {
    const pairs = [...name_qualifier_pairs];
    const attributes = [];
    const helper_callback = function(idarray) {
      const [name, qualifier] = pairs.pop();
      const items = idarray.map(id => `repeating_${name}_${id}_${qualifier}_line`)
        .filter(line => line != line_id);
      attributes.push(...items);
      if (pairs.length > 0) {
        getSectionIDs(pairs[pairs.length - 1][0], helper_callback);
      } else {
        getAttrs(attributes, values => {
          const dictionary = Object.entries(values)
            .filter(([key, val]) => val == tgtline)
            .reduce((obj, [key, val]) => { obj[key] = 2; return obj; }, {});
          callback(dictionary);
        });
      }
    }
    getSectionIDs(pairs[pairs.length - 1][0], helper_callback);
  };


function equip_inner(curLine, curName, curSource, leftID, rightID, fistsID, type) {
    // Unequip 
    let ued = {};
    let actionString = "";
    if( curSource == leftID && curLine != 0) {
        ued["inv_hand_left_id"] = fistsID;
        ued["inv_hand_left_name"] = UNEQUIP_NAME;
        ued["inv_hand_left_type"] = WEAPON_TYPE_MELEE;
        actionString = `Odkłada z lewej ręki ${curName}`
    }
    if( curSource == rightID && curLine != 1) {
        ued["inv_hand_right_id"] = fistsID;
        ued["inv_hand_right_name"] = UNEQUIP_NAME;
        ued["inv_hand_right_type"] = WEAPON_TYPE_MELEE;
        actionString = `Odkłada z prawej ręki ${curName}`
    }
    if( Object.keys(ued).length > 0 ) {
        setAttrs(ued);
    }
    if(  curLine > 1 ) {
        if( actionString.length > 0 ) {
            startRoll(`&{template:message} {{message=${actionString}}}`, (results) => {
                finishRoll(results.rollId, {});
            });
        }
        return;
    }
    
    generate_unequip_dictionary(
        curLine, curSource,
        [["weaponsranged", "wr"], ["weaponsmelee", "wm"]],
        async (dictionary) => {
            // Equip logic
            let secondActionString = ""
            if(curLine == 0) {
                dictionary["inv_hand_left_name"] = curName;
                dictionary["inv_hand_left_id"] = curSource;
                dictionary["inv_hand_left_type"] = type;
                secondActionString = `Dobywa lewą ręką ${curName}`;
            } else if (curLine == 1) {
                dictionary["inv_hand_right_name"] = curName;
                dictionary["inv_hand_right_id"] = curSource;
                dictionary["inv_hand_right_type"] = type;
                secondActionString = `Dobywa prawą ręką ${curName}`;
            }
            setAttrs(dictionary); 
            if( actionString.length > 0 ) {
                actionString += " a następnie ";
            }
            if( secondActionString.length > 0) {
                actionString += secondActionString;
            }
            if( actionString.length > 0 ) {
                startRoll(`&{template:message} {{message=${actionString}}}`, (results) => {
                    finishRoll(results.rollId, {});
                });
            }
      });
}

on("change:repeating_weaponsranged:wr_line", async (eventInfo) => {
    const v1 = getAttrs(["repeating_weaponsranged_wr_line", "repeating_weaponsranged_wr_name", "inv_hand_left_id", "inv_hand_right_id", "global_fists_id"], (v1) => {
        let curLine = v1.repeating_weaponsranged_wr_line;
        let curName = v1.repeating_weaponsranged_wr_name;
        let curSource = eventInfo.sourceAttribute;
        let leftID = v1.inv_hand_left_id;
        let rightID = v1.inv_hand_right_id;
        let fistsID = v1.global_fists_id;
        equip_inner(curLine, curName, curSource, leftID, rightID, fistsID, WEAPON_TYPE_RANGED);
    });
 });

 on("change:repeating_weaponsmelee:wm_line", async (eventInfo) => {
    const v1 = getAttrs(["repeating_weaponsmelee_wm_line", "repeating_weaponsmelee_wm_name", "inv_hand_left_id", "inv_hand_right_id", "global_fists_id"], (v1) => {
        let curLine = v1.repeating_weaponsmelee_wm_line;
        let curName = v1.repeating_weaponsmelee_wm_name;
        let curSource = eventInfo.sourceAttribute;
        let leftID = v1.inv_hand_left_id;
        let rightID = v1.inv_hand_right_id;
        let fistsID = v1.global_fists_id;
        equip_inner(curLine, curName, curSource, leftID, rightID, fistsID, WEAPON_TYPE_MELEE);
    });
 });

on("sheet:opened", (eventInfo) => {
    getSectionIDs("weaponsmelee", (idarray) => {
        fistfields = idarray.map(id => `repeating_weaponsmelee_${id}_wm_fists`);
        getAttrs(fistfields, (v1) => {
            var dictionary = {};
            var redundantFists = [];
            Object.keys(v1).forEach( (key, index) => {
                if( v1[key] == 1) {
                    if (!("global_fists_id" in dictionary)) {
                        dictionary["global_fists_id"] = key.replace("fists", "line");
                    } else {
                        redundantFists.push(key);
                    }
                }
            });
            if(!("global_fists_id" in dictionary)) {
                var newrowid = generateRowID();
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_fists"] = 1; // Unique flag marking this as fists
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_name"] = "Pięść";
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_req_strength"] = 0;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_weight"] = 0;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_line"] = 2;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_bonus_attack"] = 0;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_bonus_defense"] = 0;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_bonus_multiple"] = 0;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_bonus_blunt"] = 1;
                
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_0"] = 10;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_0_a"] = 1;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_0_b"] = 1;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_0_c"] = 1;
                
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_1"] = 12;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_1_a"] = 1;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_1_b"] = 1;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_1_c"] = 3;
                
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_2"] = 14;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_2_a"] = 1;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_2_b"] = 3;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_2_c"] = 3;
                
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_3"] = 16;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_3_a"] = 1;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_3_b"] = 3;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_3_c"] = 9;
                
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_4"] = 18;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_4_a"] = 3;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_4_b"] = 3;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_4_c"] = 9;
                
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_5"] = 19;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_5_a"] = 3;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_5_b"] = 9;
                dictionary["repeating_weaponsmelee_" + newrowid + "_wm_dmg_thresh_5_c"] = 9;
                log("Fists not found - added");
            }
            if(redundantFists.length > 0) {
                log("Multiple fists detected!");
                // TODO: Remove extra fists
            }
            setAttrs(dictionary);
        });
    });
});



 // Weight calculations
 on("change:repeating_weaponsranged:wr_ammo change:repeating_weaponsranged:wr_empty_weight", (eventInfo) => {
    getAttrs(["repeating_weaponsranged_wr_ammo", "repeating_weaponsranged_wr_empty_weight", "repeating_weaponsranged_wr_bullet_weight"], (v) => {
        let ammo = (parseInt(v.repeating_weaponsranged_wr_ammo)||0);
        let empty_weight = (parseInt(v.repeating_weaponsranged_wr_empty_weight)||0);
        let bullet_weight = (parseInt(v.repeating_weaponsranged_wr_bullet_weight)||0);
        let total_weight = empty_weight + ammo*bullet_weight;
        setAttrs({repeating_weaponsranged_wr_total_weight:total_weight});
    });
 });



 // Range table
 const WEAPON_RANGE_P   = 0;
 const WEAPON_RANGE_PM  = 1;
 const WEAPON_RANGE_K   = 2;
 const WEAPON_RANGE_S   = 3;
 const WEAPON_RANGE_SR  = 4;
 const WEAPON_RANGE_L   = 5;

 const WEAPON_RANGE_TABLE = [
    //           P       PM      K       S       SR         
    [10,     [   0,      0,      0,      0,      -30 ]],
    [20,     [   20,     10,     0,      0,      0   ]],
    [30,     [   40,     20,     10,     10,     30  ]],
    [40,     [   80,     30,     10,     10,     NaN ]],
    [60,     [   120,    40,     20,     20,     NaN ]],
    [80,     [   160,    60,     20,     20,     NaN ]],
    [100,    [   NaN,    80,     30,     30,     NaN ]],
    [150,    [   NaN,    120,    40,     30,     NaN ]],
    [200,    [   NaN,    160,    60,     40,     NaN ]],
    [250,    [   NaN,    NaN,    80,     40,     NaN ]],
    [300,    [   NaN,    NaN,    120,    60,     NaN ]],
    [400,    [   NaN,    NaN,    160,    80,     NaN ]],
    [600,    [   NaN,    NaN,    NaN,    100,    NaN ]],
    [1000,   [   NaN,    NaN,    NaN,    120,    NaN ]],
    [1500,   [   NaN,    NaN,    NaN,    160,    NaN ]]
];

function getRangePenalty(type, range) {
    if( type > WEAPON_RANGE_L || type < 0 ) {
        return NaN;
    }
    if(type == WEAPON_RANGE_L) {
        return range*2;
    } else {
        for(var i=0; i<WEAPON_RANGE_TABLE.length; ++i) {
            if( range <= WEAPON_RANGE_TABLE[i][0]) {
                return WEAPON_RANGE_TABLE[i][1][type];
            }
        }
        return NaN;
    }
}

const FIRE_MODE_S = "mode-s";
const FIRE_MODE_SB = "mode-sb";
const FIRE_MODE_SA = "mode-sa";
const FIRE_MODE_SBA = "mode-sba";
const FIRE_MODE_BA = "mode-ba";
const FIRE_MODE_A = "mode-a";

function setWeaponSkillsSheet(hand) {
    let handField = `inv_hand_${hand}_type`;
    let handFieldID = `inv_hand_${hand}_id`;
    let dictionary = {
        "selectedWeaponHand":hand, 
        "weaponskillssheetTab":WEAPON_TYPE_NONE,
        "selected_weapon_ID":"",
        "modi_battle":0,
        "modi_distance_penalty":0,
        "weapon_attack_penalty":0,
        "selected_weapon_ranged_fire_button":-1,
        "weapon_attack_range":0,
        "inaccuracy_penalty":0,
    };
    getAttrs([handField, "inv_hand_left_id", "inv_hand_right_id"], (v1) => {
        if( hand != HAND_NONE ) {
            let selectedWeaponID = v1[handFieldID];
            dictionary["selected_weapon_ID"] = selectedWeaponID;
            dictionary["modi_battle"] = 1;
            switch( v1[handField] ) {
                case WEAPON_TYPE_RANGED:
                    dictionary["weaponskillssheetTab"] = WEAPON_TYPE_RANGED;
                    let selectedWeaponFireModeField = selectedWeaponID.replace("_line", "_modes");
                    let selectedWeaponAccuracyBonus = selectedWeaponID.replace("_line", "_bonus_accuracy");
                    getAttrs([selectedWeaponFireModeField, selectedWeaponAccuracyBonus], (v2) => {
                        let bonus_accuracy = (parseInt(v2[selectedWeaponAccuracyBonus])||0);
                        let mode = "";
                        let burst = "";
                        switch(Number.parseInt(v2[selectedWeaponFireModeField])) {
                            case 0:
                                burst = "none";
                                mode = FIRE_MODE_S;
                                break;
                            case 1:
                                burst = "burst";
                                mode = FIRE_MODE_SB;
                                break;
                            case 2:
                                burst = "auto";
                                mode = FIRE_MODE_SA;
                                break;
                            case 3:
                                burst = "both";
                                mode = FIRE_MODE_SBA;
                                break;
                            case 4:
                                burst = "both";
                                mode = FIRE_MODE_BA;
                                break;
                            case 5:
                                burst = "auto";
                                mode = FIRE_MODE_A;
                                break;
                        }
                        dictionary["selected_weapon_ranged_fire_mode"] = mode;
                        dictionary["selected_weapon_ranged_fire_mode_burst"] = burst;
                        // Invert sign to convert weapon accuracy bonus into (potentially negative) inaccuracy "penalty"
                        dictionary["inaccuracy_penalty"] = -bonus_accuracy;
                        setAttrs(dictionary);
                    });
                    return;

                case WEAPON_TYPE_MELEE:
                    dictionary["weaponskillssheetTab"] = WEAPON_TYPE_MELEE;
                    setAttrs(dictionary);
                    return;
            }
            
        }
        // No hand case
        setAttrs(dictionary);
    });
    
}

// Show appropriate weapon tab based on weapon type
on(`clicked:use_slot_left`, () => {
    setWeaponSkillsSheet(HAND_LEFT);
});
on(`clicked:use_slot_right`, () => {
    setWeaponSkillsSheet(HAND_RIGHT);
});
on(`clicked:use_slot_none`, () => {
    setWeaponSkillsSheet(HAND_NONE);
});

on(`change:weapon_attack_range`, (eventInfo) => {
    getAttrs(["weaponskillssheetTab", "selected_weapon_ID"], (v1) => {
        if(v1["weaponskillssheetTab"] != WEAPON_TYPE_RANGED) {
            log("Ranged weapon range set but selected weapon isn't ranged!")
            return;
        }
        rangeFieldName = v1["selected_weapon_ID"].replace("_line", "_range");
        getAttrs([rangeFieldName, "weapon_attack_range"], (v2) => {
            let penalty = getRangePenalty(v2[rangeFieldName], v2["weapon_attack_range"]);
            penalty = isNaN(penalty) ? 9999 : penalty; 
            setAttrs({"weapon_attack_penalty":penalty});
        });
        
    });
});

const sf_btnlist = [
    "single_1",
    "single_2",
    "single_3"
];

const af_btnlist = [
    "auto_1",
    "auto_2",
    "auto_3"
];

sf_btnlist.forEach((ssb) => {
    on(`clicked:weapon_ranged_shot_${ssb}`, (info) => {
        let btnid = (parseInt(ssb.split("_").pop())||0);
        setAttrs({
            ["selected_weapon_ranged_fire_button"]: btnid
          });
    });
});

af_btnlist.forEach((afi) => {
    on(`clicked:weapon_ranged_shot_${afi}`, (info) => {
        let btnid = (parseInt(afi.split("_").pop())||0) + 3;
        setAttrs({
            ["selected_weapon_ranged_fire_button"]: btnid
          });
    });
});

/*************************** EKWIPUNEK ****************************/
/******************************************************************/
