module.exports = (sequelize, DataTypes) => {
    const Carte = sequelize.define('Carte', {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        attaque: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        defense: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        bouclier: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        timestamps: true,
    });

    Carte.associate = (models) => {
        Carte.belongsToMany(models.Vaisseau, { through: 'VaisseauCarte' });
    };

    return Carte;
};
