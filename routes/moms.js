// Markdown routes(CRUD features)

const express = require("express");
const Mom = require("../models/Mom");
const router = express.Router();

// @desc Add page
// @route GET /moms/add
router.get("/add", (req, res) => {
  // res.render("moms/add");
});

// @desc process Add form
// @route POST /moms
router.post("/", async (req, res) => {
  try {
    // req.body.user = req.user.id;
    await Mom.create(req.body);
    // res.redirect("/dashboard");
    res.send(req.body);
  } catch (err) {
    console.error(err);
    // res.render("error/500");
  }
});

// @desc Show all moms (public)
// @route GET /moms
router.get("/", async (req, res) => {
  try {
    // const moms = await User.find()
    const moms = await Mom.find().populate("user").sort({ createdAt: "desc" });
    // .lean();

    res.json({ moms: moms });
    // return {
    //   moms: moms,
    // };
    // console.log(`${moms} this is coming from line 37 `);

    /* 
    res.render("moms/index", {
      moms
    }) */
  } catch (err) {
    console.error(err);
    // res.render("error/500");
  }
});

// @desc Show single MoM
// @route GET /moms/:id
router.get("/:id", async (req, res) => {
  try {
    const mom = await Mom.findById(req.params.id).populate("user").lean();

    if (!mom) {
      // return res.render("error/404");
    }

    /*
    res.render("moms/show", {
      mom
    }); */
  } catch (err) {
    console.error(err);
    // return res.render("error/404");
  }
});

// @desc Edit page
// @route GET /moms/edit/:id
router.get("/edit/:id", async (req, res) => {
  const mom = await Mom.findOne({
    _id: req.params.id,
  }).lean();

  if (!mom) {
    // return res.render("error/404")
  }

  // If some other user tries to edit MoM
  if (mom.user !== req.user.id) {
    res.redirect("/moms");
  } else {
    /*
    res.render("moms/edit", {
      mom
    }) */
  }
});

// @desc Update MoM
// @route PUT /moms/:id
router.put("/:id", async (req, res) => {
  try {
    let mom = Mom.findById(req.params.id).lean();

    if (!mom) {
      // return res.render("error/404");
    }

    // If some other user tries to update MoM
    if (mom.user !== req.user.id) {
      res.redirect("/moms");
    } else {
      mom = await Mom.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    // return res.render("error/500");
  }
});

// @desc Delete MoM
// @ route DELETE /moms/:id
router.delete("/:id", async (req, res) => {
  try {
    const mom = await Mom.findById(req.params.id).lean();

    if (!mom) {
      // return res.render("error/404");
    }

    if (mom.user !== req.user.id) {
      res.redirect("/moms");
    } else {
      await Mom.remove({ _id: req.params.id });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    // return res.render("error/500");
  }
});

// @desc Singer user MoMs
// @route GET /moms/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const moms = await Mom.find({
      user: req.params.userId,
    })
      .populate("user")
      .lean();
    console.log(await Mom.findById("6103029f96bb0f491446c2ac"));
    console.log(req.params.userId);
    res.json({ singleUserMoms: moms });
    // console.log(moms);

    /*
    res.render('moms/index', {
      moms,
    }); */
  } catch (err) {
    console.error(err);
    // res.render("error/500");
  }
});

module.exports = router;
