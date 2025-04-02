module.exports = (sequelize, DataTypes) => {
    const Vaisseau = sequelize.define('Vaisseau', {
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
        }
    }, {
        timestamps: true,
    });

    Vaisseau.associate = (models) => {
        Vaisseau.belongsTo(models.CategorieTaille, { foreignKey: 'categorieTailleId' });
        Vaisseau.belongsToMany(models.Faction, { through: 'VaisseauFaction' });
        Vaisseau.belongsToMany(models.Carte, { through: 'VaisseauCarte' });
        Vaisseau.hasMany(models.Cadran, { foreignKey: 'vaisseauCadran' });
        Vaisseau.hasMany(models.ImageVaisseau, { foreignKey: 'vaisseauId' });  // Association avec les images
    };

    return Vaisseau;
};
