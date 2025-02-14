const pool = require("../db");

// Get likes for a project
exports.getLikes = async (req, res) => {
    try {
        const { projectName } = req.params;
        const userId = req.query.userId;

        if (!projectName || !userId) {
            return res.status(400).json({ error: "Missing projectName or userId" });
        }

        const result = await pool.query(
            `SELECT COUNT(*) AS likeCount, 
                    EXISTS (SELECT 1 FROM projectLikes WHERE projectName = $1 AND userId = $2) AS liked 
             FROM projectLikes 
             WHERE projectName = $1`,
            [projectName, userId]
        );

        const likeCount = parseInt(result.rows[0].likecount, 10);
        const liked = result.rows[0].liked;

        console.log(`Total likes: ${likeCount}, User liked: ${liked}`);

        res.json({ likeCount, liked });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database error checking user like" });
    }
};

// Toggle Like
exports.toggleLike = async (req, res) => {
    try {
        const { projectName } = req.params;
        const userId = req.body.userId || req.ip;

        const checkLike = await pool.query(
            `SELECT * FROM projectLikes WHERE projectName = $1 AND userId = $2`,
            [projectName, userId]
        );

        if (checkLike.rows.length > 0) {
            // User already liked → Remove like
            await pool.query(
                `DELETE FROM projectLikes WHERE projectName = $1 AND userId = $2`,
                [projectName, userId]
            );

            const likeCountResult = await pool.query(
                `SELECT COUNT(*) AS likeCount FROM projectLikes WHERE projectName = $1`,
                [projectName]
            );

            res.json({
                likeCount: parseInt(likeCountResult.rows[0].likecount, 10),
                liked: false
            });
        } else {
            // User has not liked → Add like
            await pool.query(
                `INSERT INTO projectLikes (projectName, userId) VALUES ($1, $2)`,
                [projectName, userId]
            );

            const likeCountResult = await pool.query(
                `SELECT COUNT(*) AS likeCount FROM projectLikes WHERE projectName = $1`,
                [projectName]
            );

            res.json({
                likeCount: parseInt(likeCountResult.rows[0].likecount, 10),
                liked: true
            });
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database error" });
    }
};
