addLayer("t", {
    name: "Trolls", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#918156",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Trolled People", // Name of prestige currency
    baseResource: "Oil", // Name of resource prestige is based on
    baseAmount() {
        return player.points
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration(){return hasMilestone("u", 0)},
    branches: ["u", "e", "m"],
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key: "t", description: "T: Reset your Oil for Trolled People", onPress() {
                if (canReset(this.layer)) doReset(this.layer)
            }
        },
    ],
    layerShown() {
        return true
    },
    upgrades: {
        rows: 3,
        cols: 3,
        11: {
            title: "Cover yourself in Oil",
            description: "Trolled People multiply your Oil gain",
            effect() {
                if (hasUpgrade("u", 12)){
                    return new Decimal(1)
                }
                if (player.t.points.gte(1)){
                    if (hasUpgrade("u", 11)){
                        return player.t.points.log(2).plus(2)
                    }
                    if (hasUpgrade("t", 13)){
                        return player.t.points.log(1.1).plus(2)
                    }
                    else{
                        return player.t.points.log(2).plus(2)
                    }
                }
                else
                    return new Decimal(2)
            },
            effectDisplay() {
                if (hasUpgrade("u", 12)){
                    return 'DISABLED'
                }
                return `${format(upgradeEffect("t", 11))}x`
            },
            cost: new Decimal(2),
        },
        12: {
            title: "Oil Duplication",
            description: "Oil multiplies Oil gain",
            effect() {
                if (hasUpgrade("m", 11)){
                    return new Decimal(1)
                }
                if (player.points.gte(1))
                    return player.points.sqrt().plus(1)
                else
                    return new Decimal(1)
            },
            effectDisplay() {
                if (hasUpgrade("m", 11)){
                    return 'DISABLED'
                }
                return `${format(upgradeEffect("t", 12))}x`
            },
            cost: new Decimal(10),
        },
        13: {
            title: "Advanced Oil Covering Techniques",
            description: "Cover Yourself in Oil uses a better formula",
            effectDisplay() {
                if (hasUpgrade("u", 11)){
                    return 'DISABLED'
                }
                if (hasUpgrade("t", 13))
                return `Unlocked`
                else
                    return `Locked`
            },
            cost: new Decimal(50),
        },
        32: {
            title: "Reveal your Oil",
            description: "Reveal your mass amounts of Trolls and huge supplies of Oil",
            cost: new Decimal(200),
        },
    }
})
addLayer("u", {
    name: "USA", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "USA", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#fc2803",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Anti-Trolls", // Name of prestige currency
    baseResource: "Oil", // Name of resource prestige is based on
    baseAmount() {
        return player.points
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration(){return hasUpgrade("t", 32)},
    canReset() {
        return false;
    },
    branches: [],
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        if (!hasUpgrade("m", 13))
        return hasUpgrade("t", 32)
        else
            return false
    },
    infoboxes: {
        lore: {
            title: "USA ",
            body() { return "The USA has discovered your massive amounts of Oil and attacked. Anti-Trolls now flood your Oil drilling operation. These Anti-Trolls will disable things and damage your production, but your Trolled People may find ways to make these damages boost other things..." },
        },
    },
    milestones: {
        0: {
            requirementDescription: "50 Anti-Trolls",
            effectDescription() {
                return "You gain 100% of your Trolled People gained on reset every second but USA Upgrade 2 is now log(2)";
            },
            done() {
                if (hasUpgrade("u", 12))
                return player.u.points.gte(50)
            },
            unlocked() {return hasUpgrade("u", 12)}
        },
        1: {
            requirementDescription: "300 Anti-Trolls",
            effectDescription() {
                return "Unlock a new USA Upgrade";
            },
            done() {
                if (hasUpgrade("u", 12))
                    return player.u.points.gte(300)
            },
            unlocked() {return hasUpgrade("u", 12)}
        },
    },
    upgrades: {
        rows: 3,
        cols: 3,
        11: {
            title: "Invasion",
            description: "Disable Oil Upgrade 3 but unlock a new Layer",
            cost: new Decimal(100),
            effectDisplay() {
                if (hasUpgrade("u", 11))
                    return `Unlocked`
                else
                    return `Locked`
            }
        },
        12: {
            fullDisplay: "<h3>Anti-Trolling Protocols</h3><br>Divide Oil gain by the log10 of Troll Energy (after all other effects), and reset Oil and Anti-Trolls, but unlock USA Milestones<br><br>Requires: 300 Anti-Trolls",
            canAfford(){return (player.u.points.gte(300))},
            pay() {
              player.points = player.points.sub(player.points)
              player.u.points = player.u.points.sub(player.u.points)
            },
            effectDisplay() {
                if (hasUpgrade("u", 12))
                    return `Unlocked`
                else
                    return `Locked`
            },
        },
        13: {
            unlocked(){return hasMilestone("u", 1)},
            fullDisplay: "<h3>Oil Rig Takeovers</h3><br>The second USA Upgrade is applied again, this time before all other effects, reset Oil and Anti-Trolls, and set Troll Energy to 10, but unlock a new Layer<br><br>Requires: 400 Anti-Trolls",
            canAfford(){return (player.u.points.gte(400))},
            pay() {
                player.points = player.points.sub(player.points)
                player.u.points = player.u.points.sub(player.u.points)
                player.e.points = new Decimal(10)
            },
            effectDisplay() {
                if (hasUpgrade("u", 13))
                    return `Unlocked`
                else
                    return `Locked`
            },
        },
    }
})
addLayer("e", {
    name: "Troll Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "TE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#0089d9",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    resource: "Troll Energy", // Name of prestige currency
    baseResource: "Oil", // Name of resource prestige is based on
    branches: ["m"],
    update() {
      if (hasUpgrade("m", 11)){
          addPoints("e", player.t.points.log(10))
      }
    },
    baseAmount() {
        return player.points
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.3,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration(){return hasUpgrade("u", 11)},
    canReset() {
        return false;
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        if (!hasUpgrade("m", 13))
        return hasUpgrade("u", 11)
        else
            return false
    },
    effect(){
        return player.e.points.sqrt()
    },
    effectDescription() {
        return `which multiplies Oil gain by ${format(tmp.e.effect)}x`
    }
})
addLayer("m", {
    name: "META OIL", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MO", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#fb00ff",
    requires: new Decimal(9.6e9696969696969696), // Can be a function that takes requirement increases into account
    resource: "Meta Oil", // Name of prestige currency
    baseResource: "???", // Name of resource prestige is based on
    branches: [],
    baseAmount() {
        return new Decimal(0)
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    canReset() {
        return false;
    },
    branches: [],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        return hasUpgrade("u", 13)
    },
    shouldNotify: true,
    glowColor: "#fb00ff",
    milestones: {
        0: {
            requirementDescription: "1000 Oil",
            effectDescription() {
                return "ś̵̨̧̰̟͖̫̰̞̱̙̟̩̬͉̍̾̓͂͒ǝ̷̢̳̝͉̘͙͕̠̰͎̟̰̘̿̾̋̑̑̿̐͋̈́̕͠p̵̺̭͓͚͍̻̳͕̝͇͎̣̉̾̇̐̎͌̒̀ɐ̴̛͇̐͂͐̇̇͗̅̀̇̂̽́͝ɹ̴̨̤̤̰͚̹͔͔̅̊̈́̓͗͌̏̐̄̕͠ƃ̵͖̈́̆̂̔̓̄̍̕ḑ̸͇͕̳̮̰̲̮̲̝͉̮̝̻́̊͗ͅn̵̢̧̲̜̝͖̦͇͍͚͚͇̼͙̽̋̈́͋͒̓̾̀͑͆̕͜ʞ̴̺̭̺̯̱͈̫̰̪͍́͗̀͑̿͛͒̚̚͠͝ͅɔ̴̨̉̌̀̎̕͝ơ̷̡̢͈͔̹̼̹̐̊́̍̑̂͝l̷̡̦͕̫̼̭̭̘̯͍̪̠̎͑̏͌̍̾́̒͛ͅṷ̵̻̜̣͉̈́̀̋́̈́͗̓͘͠ņ̶̰̲͔̫͕͇͖̟̆̒̈̀̈́̏̀̀̔̅̎̚͝p̶̡̛̣̱̮̦̥͇̙͉̾̉̈́͑̈͘ͅų̸̡̻̰̙̤̝͕̉̈́͌̚ɐ̷̢͙̬͔̦̈́̽̊̂̋͊ͅḷ̴̨̗̣̮̗̙̾͂̌̾̈͐̍̕͝͝͠ͅᴉ̵͎͆͗̓͋̋̚o̷̟͔̰̺̫̮̩̓̀̒̉̊͌͂ɐ̴̢̟̪͚̣̲̝̥͉̼̤͕͇̠̓̈̈̉̀͝͝ʇ̵̟̫̰̘̜͍͇͈̱̳͔̈̍̿ǝ̷͉͇̠̓̅͗̓͛̒͂̒̂̎̏̓̚̕ɯ̵̢̛̦̰͇̜̲͉̬͇̘̤͗͋͗̋͂̇͛̃͌̈́̚͝͠ǝ̷̨̰̘̮͔̰́͊̒͑̒͗͛͊̅̆͘ư̶̧̨̹̣̮̥͉̳͉̲̖̥͌͗͗̆̾ͅô̴̩̗̫̥̼͉̖̩̝̻̿̂̈͒̈́̀͒̽͆̃̑̎͝͝";
            },
            done() {
                if (hasUpgrade("u", 13))
                    return player.points.gte(1000)
            },
            unlocked() {return hasUpgrade("u", 13)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        1: {
            requirementDescription: "100 Oil",
            effectDescription() {
                return "ļ̷̳̳̳̻̓̀ᴉ̴͔̜̖͎͙̺̤̱͑̑̽͠ͅǫ̸̫̟̺̪͛̃̈́̍̀̌͗͗͆̄ɐ̶̛̫̣̱͓̗͚̗͕̲̻͎̎̈͜ͅʇ̴̨̯̯̲̱̬̱̗̇̇͂͊̍̓͠ǝ̶͎͋̚ɯ̴͚̻̳̭̮̫̹͔̗̀̆̈́͋͆͛̓̉̀͜ɹ̵̢̗̗͙͉͕̯̩̠̋̌́͋͜ǝ̵̘͖̫̖̅̊ɥ̵̡̜̗̘̪͙̣̰͉̫͖͈̰̃̀́̀̒͆̎̔̍̏̄̊̀ʇ̶̢̨̡̢̛͚̹͉̳̬̥̩̤̣͙̪̊̃̃̓̐̇͗́̌̓́͌͘͝ợ̸̦͆̒͋̐͋͝ṷ̷̡̥͔̹̩̟̪͓̖͍̥̭̲͚̿̿͒͐̈ɐ̷̰̟͒̈́̂̕͠p̴̲̾͊́̅͛u̸͓̞̝͈͕̖͖̯̜̘̮͆͌͌͊̓̂̎͝͝ɐ̴̨̝̮̘̱̙͕̱̖͓̦̐͑̔͊́̉̄̆͑̾̚̚͜͝͠ǝ̸̪̻͙̖̼̊̉́̏̔͊̄̕͘p̵̢̛̭̣̪̪̀̊̕ɐ̵̯̟̮̟̻̉́͐̚ɹ̵̛̤͎̺̜̫̦̼̂̂̋͛̅͐̍̿̃̈́́̚͜ͅƃ̸̡̢̡̨͈̼̣͕̔́̂̒̄̂̔̀͑̄͝͝͝d̵̛͓̰̗̗͙̝͓͚͕̟͉̘̥͎͋̏̒̈́̓̈ͅń̷̤̫̌̔͒̓͛ɹ̷̖̤̳̦̳̭̠͖͈̘̪͍͈̐̋̕͝ǝ̸̨̝͓̫̺̞̰̰̼̻̭̋̽̿́̚ͅɥ̵̛̹̞͚̤̣̱̗̲̾̇͑͒̌͑̕͠ʇ̸̨̬̯̦̗̪̰͔͇͙̅̽̎ͅǒ̵͙̙̩̫̜̣͔̪̮̭̩̽͐̃̾̎̕͝͠ų̷̢͍̟̤̞̟̯͚̝̹̗̙̆́̈́̑̉̄̔͒̌͠ɐ̴̧̛̛͍͓̥̮̹̺̼̼̙͚̱̯͍̓̅̏͋̔̏̍̋̚͝ʞ̶̨̦̜̹͚̫͕̬͚̙̬̳̹̯̉̉̆ɔ̷̢͙̘͖̩͍͓̲̳̳͇̘͙̍̀͑̈́͛̐͂̈́̚͘ố̵͕́̓͋̈́̋͆̈́̀̈́͆̚͝͠l̶̢̢͓̤̲͚̦̰̝͙̠̼͚͈̅̎̅͒̿̐̑̆̉͋̂̚͝ͅu̶̢̥̻͑͒͐̐̋̊̽̎͗̑́̀͗̚͝n̶̨̡̧͓͇̥͇̝̻̺͈̪͈̯̐͗͗̓̊̉̋̈́̌̉͘";
            },
            done() {
                if (hasUpgrade("m", 11))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("u", 13)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        2: {
            requirementDescription: "100.",
            effectDescription() {
                return "Ǝ̴̧̠̠̟̘̰̳̹̗̙͇̻̥̆̄͋˥̵̡̭͕͇͈̘̇͂͘̕͜͜ͅƆ̶̢̨͔̟̙̩͉̮̲̠̭̹̉̈́͛̊̋͋̂̽́̿̏͆̆̅̔͜⅄̵̨͖͔̟̤̩̱̗̜͚͍̥̞͕̭̏̍͐̀Ɔ̸̧̰̮͍̙̦̠͙͚͕̱̭͔͊̊̂́͑̅͑͊͐͘͜͠Ǝ̶̥̗̯̐̈́͜Ḧ̵̥͕̬̮͚̻́┴̸̨̯̟̬͇̼͚̓";
            },
            done() {
                if (hasUpgrade("m", 12))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("m", 12)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        3: {
            requirementDescription: "100.",
            effectDescription() {
                return "Ǝ̴̧̠̠̟̘̰̳̹̗̙͇̻̥̆̄͋˥̵̡̭͕͇͈̘̇͂͘̕͜͜ͅƆ̶̢̨͔̟̙̩͉̮̲̠̭̹̉̈́͛̊̋͋̂̽́̿̏͆̆̅̔͜⅄̵̨͖͔̟̤̩̱̗̜͚͍̥̞͕̭̏̍͐̀Ɔ̸̧̰̮͍̙̦̠͙͚͕̱̭͔͊̊̂́͑̅͑͊͐͘͜͠Ǝ̶̥̗̯̐̈́͜Ḧ̵̥͕̬̮͚̻́┴̸̨̯̟̬͇̼͚̓";
            },
            done() {
                if (hasUpgrade("m", 12))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("m", 12)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        4: {
            requirementDescription: "100.",
            effectDescription() {
                return "Ǝ̴̧̠̠̟̘̰̳̹̗̙͇̻̥̆̄͋˥̵̡̭͕͇͈̘̇͂͘̕͜͜ͅƆ̶̢̨͔̟̙̩͉̮̲̠̭̹̉̈́͛̊̋͋̂̽́̿̏͆̆̅̔͜⅄̵̨͖͔̟̤̩̱̗̜͚͍̥̞͕̭̏̍͐̀Ɔ̸̧̰̮͍̙̦̠͙͚͕̱̭͔͊̊̂́͑̅͑͊͐͘͜͠Ǝ̶̥̗̯̐̈́͜Ḧ̵̥͕̬̮͚̻́┴̸̨̯̟̬͇̼͚̓";
            },
            done() {
                if (hasUpgrade("m", 12))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("m", 12)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        5: {
            requirementDescription: "100.",
            effectDescription() {
                return "Ǝ̴̧̠̠̟̘̰̳̹̗̙͇̻̥̆̄͋˥̵̡̭͕͇͈̘̇͂͘̕͜͜ͅƆ̶̢̨͔̟̙̩͉̮̲̠̭̹̉̈́͛̊̋͋̂̽́̿̏͆̆̅̔͜⅄̵̨͖͔̟̤̩̱̗̜͚͍̥̞͕̭̏̍͐̀Ɔ̸̧̰̮͍̙̦̠͙͚͕̱̭͔͊̊̂́͑̅͑͊͐͘͜͠Ǝ̶̥̗̯̐̈́͜Ḧ̵̥͕̬̮͚̻́┴̸̨̯̟̬͇̼͚̓";
            },
            done() {
                if (hasUpgrade("m", 12))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("m", 12)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        6: {
            requirementDescription: "100.",
            effectDescription() {
                return "Ǝ̴̧̠̠̟̘̰̳̹̗̙͇̻̥̆̄͋˥̵̡̭͕͇͈̘̇͂͘̕͜͜ͅƆ̶̢̨͔̟̙̩͉̮̲̠̭̹̉̈́͛̊̋͋̂̽́̿̏͆̆̅̔͜⅄̵̨͖͔̟̤̩̱̗̜͚͍̥̞͕̭̏̍͐̀Ɔ̸̧̰̮͍̙̦̠͙͚͕̱̭͔͊̊̂́͑̅͑͊͐͘͜͠Ǝ̶̥̗̯̐̈́͜Ḧ̵̥͕̬̮͚̻́┴̸̨̯̟̬͇̼͚̓";
            },
            done() {
                if (hasUpgrade("m", 12))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("m", 12)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        7: {
            requirementDescription: "100.",
            effectDescription() {
                return "Ǝ̴̧̠̠̟̘̰̳̹̗̙͇̻̥̆̄͋˥̵̡̭͕͇͈̘̇͂͘̕͜͜ͅƆ̶̢̨͔̟̙̩͉̮̲̠̭̹̉̈́͛̊̋͋̂̽́̿̏͆̆̅̔͜⅄̵̨͖͔̟̤̩̱̗̜͚͍̥̞͕̭̏̍͐̀Ɔ̸̧̰̮͍̙̦̠͙͚͕̱̭͔͊̊̂́͑̅͑͊͐͘͜͠Ǝ̶̥̗̯̐̈́͜Ḧ̵̥͕̬̮͚̻́┴̸̨̯̟̬͇̼͚̓";
            },
            done() {
                if (hasUpgrade("m", 12))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("m", 12)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        8: {
            requirementDescription: "100.",
            effectDescription() {
                return "Ǝ̴̧̠̠̟̘̰̳̹̗̙͇̻̥̆̄͋˥̵̡̭͕͇͈̘̇͂͘̕͜͜ͅƆ̶̢̨͔̟̙̩͉̮̲̠̭̹̉̈́͛̊̋͋̂̽́̿̏͆̆̅̔͜⅄̵̨͖͔̟̤̩̱̗̜͚͍̥̞͕̭̏̍͐̀Ɔ̸̧̰̮͍̙̦̠͙͚͕̱̭͔͊̊̂́͑̅͑͊͐͘͜͠Ǝ̶̥̗̯̐̈́͜Ḧ̵̥͕̬̮͚̻́┴̸̨̯̟̬͇̼͚̓";
            },
            done() {
                if (hasUpgrade("m", 12))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("m", 12)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        9: {
            requirementDescription: "100.",
            effectDescription() {
                return "Ǝ̴̧̠̠̟̘̰̳̹̗̙͇̻̥̆̄͋˥̵̡̭͕͇͈̘̇͂͘̕͜͜ͅƆ̶̢̨͔̟̙̩͉̮̲̠̭̹̉̈́͛̊̋͋̂̽́̿̏͆̆̅̔͜⅄̵̨͖͔̟̤̩̱̗̜͚͍̥̞͕̭̏̍͐̀Ɔ̸̧̰̮͍̙̦̠͙͚͕̱̭͔͊̊̂́͑̅͑͊͐͘͜͠Ǝ̶̥̗̯̐̈́͜Ḧ̵̥͕̬̮͚̻́┴̸̨̯̟̬͇̼͚̓";
            },
            done() {
                if (hasUpgrade("m", 12))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("m", 12)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        10: {
            requirementDescription: "100.",
            effectDescription() {
                return "Ǝ̴̧̠̠̟̘̰̳̹̗̙͇̻̥̆̄͋˥̵̡̭͕͇͈̘̇͂͘̕͜͜ͅƆ̶̢̨͔̟̙̩͉̮̲̠̭̹̉̈́͛̊̋͋̂̽́̿̏͆̆̅̔͜⅄̵̨͖͔̟̤̩̱̗̜͚͍̥̞͕̭̏̍͐̀Ɔ̸̧̰̮͍̙̦̠͙͚͕̱̭͔͊̊̂́͑̅͑͊͐͘͜͠Ǝ̶̥̗̯̐̈́͜Ḧ̵̥͕̬̮͚̻́┴̸̨̯̟̬͇̼͚̓";
            },
            done() {
                if (hasUpgrade("m", 12))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("m", 12)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        11: {
            requirementDescription: "100.",
            effectDescription() {
                return "Ǝ̴̧̠̠̟̘̰̳̹̗̙͇̻̥̆̄͋˥̵̡̭͕͇͈̘̇͂͘̕͜͜ͅƆ̶̢̨͔̟̙̩͉̮̲̠̭̹̉̈́͛̊̋͋̂̽́̿̏͆̆̅̔͜⅄̵̨͖͔̟̤̩̱̗̜͚͍̥̞͕̭̏̍͐̀Ɔ̸̧̰̮͍̙̦̠͙͚͕̱̭͔͊̊̂́͑̅͑͊͐͘͜͠Ǝ̶̥̗̯̐̈́͜Ḧ̵̥͕̬̮͚̻́┴̸̨̯̟̬͇̼͚̓";
            },
            done() {
                if (hasUpgrade("m", 12))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("m", 12)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
        12: {
            requirementDescription: "100.",
            effectDescription() {
                return "Ǝ̴̧̠̠̟̘̰̳̹̗̙͇̻̥̆̄͋˥̵̡̭͕͇͈̘̇͂͘̕͜͜ͅƆ̶̢̨͔̟̙̩͉̮̲̠̭̹̉̈́͛̊̋͋̂̽́̿̏͆̆̅̔͜⅄̵̨͖͔̟̤̩̱̗̜͚͍̥̞͕̭̏̍͐̀Ɔ̸̧̰̮͍̙̦̠͙͚͕̱̭͔͊̊̂́͑̅͑͊͐͘͜͠Ǝ̶̥̗̯̐̈́͜Ḧ̵̥͕̬̮͚̻́┴̸̨̯̟̬͇̼͚̓";
            },
            done() {
                if (hasUpgrade("m", 12))
                    return player.points.gte(100)
            },
            unlocked() {return hasUpgrade("m", 12)},
            onComplete(){player.m.points = player.m.points.plus(1)}
        },
    },
    upgrades: {
        rows: 3,
        cols: 3,
        11: {
            unlocked(){return hasMilestone("m", 0)},
            fullDisplay: "<h3>[Meta_Shift_01]</h3><br>Disable Oil Upgrade 2, reset Oil, and set Troll Energy and Trolled People to 10 but convert the log(10) of Trolled People to Troll Energy<br><br>Requires: 1 Meta Oil",
            canAfford(){return (player.m.points.gte(1))},
            pay() {
                player.points = player.points.sub(player.points)
                player.t.points = new Decimal(10)
                player.e.points = new Decimal(10)
            },
            effectDisplay() {
                if (hasUpgrade("m", 11))
                    return `Unlocked`
                else
                    return `Locked`
            }
        },
        12: {
            unlocked(){return hasMilestone("m", 1)},
            fullDisplay: "<h3>[Meta_Shift_02]</h3><br>Enter the Infinite Cycle<br><br>Requires: 2 Meta Oil",
            canAfford(){return (player.m.points.gte(2))},
            pay() {
                player.points = player.points.sub(player.points)
                player.t.points = new Decimal(10)
                player.e.points = new Decimal(10)
            },
            effectDisplay() {
                if (hasUpgrade("m", 12))
                    return `Unlocked`
                else
                    return `Locked`
            }
        },
        13: {
            unlocked(){return hasMilestone("m", 12)},
            fullDisplay: "<h3>U̷N̷L̵E̷A̷S̷H̵ ̶T̴H̸E̴ ̷C̶Y̸C̷L̸E̴</h3><br><br>Requires: 13 Meta Oil",
            canAfford(){return (player.m.points.gte(1))},
            pay() {
                player.points = new Decimal(1)
                player.t.points = new Decimal(10)
                player.e.points = new Decimal(10)
            },
        }
    }
})
