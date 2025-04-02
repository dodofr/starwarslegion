module.exports = (sequelize, DataTypes) => {
    const ImageVaisseau = sequelize.define('ImageVaisseau', {
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: true,
    });

    ImageVaisseau.associate = (models) => {
        ImageVaisseau.belongsTo(models.Vaisseau, { foreignKey: 'vaisseauId' });
    };

    return ImageVaisseau;
};
