module.exports = (sequelize, DataTypes) => {
    const Faction = sequelize.define('Faction', {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: true,
    });

    Faction.associate = (models) => {
        Faction.belongsToMany(models.Vaisseau, { through: 'VaisseauFaction' });
    };

    return Faction;
};
