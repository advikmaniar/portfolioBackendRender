const db = require("../db");

// Get likes for a project
exports.getLikes = (req, res) => {
    const { projectName } = req.params;
    const userId = req.query.userId;
    
    // Check if projectName or userId is missing
    if (!projectName || !userId) {
        return res.status(400).json({ error: "Missing projectName or userId" });
    }
    
    db.get("SELECT COUNT(*) AS likeCount, EXISTS(SELECT 1 FROM projectLikes WHERE projectName = ? AND userId = ?) AS liked FROM projectLikes WHERE projectName = ?", [projectName, userId, projectName], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Database error checking user like" });
        }
    
        // Log for debugging
        console.log(`Total likes: ${row.likeCount}, User liked: ${row.liked === 1}`);
    
        res.json({
            likeCount: row.likeCount,    
            liked: row.liked === 1  // Ensure `liked` is either 0 (unliked) or 1 (liked)
        });
    });
    
};


// Toggle Like
exports.toggleLike = (req, res) => {
    const { projectName } = req.params;
    const userId = req.body.userId || req.ip;

    db.get("SELECT * FROM projectLikes WHERE projectName = ? AND userId = ?", [projectName, userId], (err, row) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (row) {
            db.run("DELETE FROM projectLikes WHERE projectName = ? AND userId = ?", [projectName, userId], function (err) {
                if (err) {
                    return res.status(500).json({ error: "Database error" });
                }
                db.get("SELECT COUNT(*) AS likeCount FROM projectLikes WHERE projectName = ?", [projectName], (err, countRow) => {
                    if (err) {
                        return res.status(500).json({ error: "Database error" });
                    }
                    res.json({ likeCount: countRow.likeCount, liked: false });
                });
            });
        } else {
            db.run("INSERT INTO projectLikes (projectName, userId) VALUES (?, ?)", [projectName, userId], function (err) {
                if (err) {
                    return res.status(500).json({ error: "Database error" });
                }
                db.get("SELECT COUNT(*) AS likeCount FROM projectLikes WHERE projectName = ?", [projectName], (err, countRow) => {
                    if (err) {
                        return res.status(500).json({ error: "Database error" });
                    }
                    res.json({ likeCount: countRow.likeCount, liked: true });
                });
            });
        }
    });
};

