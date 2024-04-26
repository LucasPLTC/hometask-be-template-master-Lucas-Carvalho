class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async all() {
        return this.model.findAll();
    }

    async createTransaction(req) {
        const sequelize = req.app.get('sequelize');
        return await sequelize.transaction();
    }

    async commitTransaction(transaction) {
        if (transaction) {
            await transaction.commit();
        }
    }

    async rollbackTransaction(transaction) {
        if (transaction) {
            await transaction.rollback();
        }
    }
}

module.exports = BaseRepository;
