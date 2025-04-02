module.exports = (sequelize, DataTypes) => {
    const CategorieTaille = sequelize.define('CategorieTaille', {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: true,
    });

    CategorieTaille.associate = (models) => {
        CategorieTaille.hasMany(models.Vaisseau, { foreignKey: 'categorieTailleId' });
    };

    return CategorieTaille;
};
