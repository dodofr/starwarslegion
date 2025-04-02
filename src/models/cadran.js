module.exports = (sequelize, DataTypes) => {
    const Cadran = sequelize.define('Cadran', {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        image: {
            type: DataTypes.STRING, // Stocke le chemin de l'image
            allowNull: true, // L'image peut être optionnelle
        }
    }, {
        timestamps: true,
    });

    Cadran.associate = (models) => {
        Cadran.belongsTo(models.Vaisseau, { foreignKey: 'vaisseauCadran' });
    };

    return Cadran;
};
