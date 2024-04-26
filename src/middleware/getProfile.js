const HttpStatusCode = require('../core/HttpEnums');
const ProfileRepository = require('../repository/profile.repository.js');
const profileRepository = new ProfileRepository();

// This function extracts profile id from a request
const getProfileIdFromRequest = (req) => req.get('profile_id') || 0;

const getProfile = async (req, res, next) => {
    const profileId = getProfileIdFromRequest(req);
    const profile = await profileRepository.findProfileByProfileId(profileId);

    if (!profile) {
        return res.status(HttpStatusCode.UNAUTHORIZED).end();
    }

    req.profile = profile;
    next();
}

module.exports = {getProfile};
