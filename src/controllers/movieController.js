const router = require("express").Router();

const movieService = require("../services/movieService");
const castService = require("../services/castService");
const { isAuth } = require("../middlewares/authMiddleware");
const { getErrorMessage } = require("../utils/errorUtils");

// router.use(isAuth); // Това ауторизира всички user-и

router.get("/create", (req, res) => {
  res.render("create");
});

router.post("/create", isAuth, async (req, res) => {
  // console.log(req.body);
  const newMovie = {
    ...req.body,
    owner: req.user._id,
  };

  try {
    await movieService.create(newMovie);

    res.redirect("/");
  } catch (err) {
    const message = getErrorMessage(err);

    res.status(400).render("/create", { error: message, ...newMovie });
  }
});

router.get("/movies/:movieId", isAuth, async (req, res) => {
  const movieId = req.params.movieId;
  const movie = await movieService.getOne(movieId).lean();
  // const casts = await castService.getByIds(movie.casts).lean();
  const isOwner = movie.owner && movie.owner == req.user?._id;
  const isAuthenticated = !!req.user;

  // TODO: This is not perfect, use handlebars helpers
  // movie.rating = new Array(Number(movie.rating)).fill(true);
  movie.ratingStars = "&#x2605".repeat(movie.rating);

  // console.log(movie);
  res.render("movie/details", { movie, isOwner, isAuthenticated });
});

router.get("/movies/:movieId/attach", async (req, res) => {
  const movie = await movieService.getOne(req.params.movieId).lean();
  const casts = await castService.getAll().lean();
  // TODO: remove already added casts
  res.render("movie/attach", { ...movie, casts });
});

router.post("/movies/:movieId/attach", isAuth, async (req, res) => {
  const castId = req.body.cast;
  const movieId = req.params.movieId;

  await movieService.attach(movieId, castId);

  res.redirect(`/movies/${movieId}/attach`);
});

router.get("/movies/:movieId/edit", isAuth, async (req, res) => {
  console.log(req.user);
  if (!req.user) {
    res.redirect("/auth/login");
  }

  const movie = await movieService.getOne(req.params.movieId).lean();

  res.render("movie/edit", { movie });
});

router.post("/movies/:movieId/edit", isAuth, async (req, res) => {
  const editedMovie = req.body;

  await movieService.edit(req.params.movieId, editedMovie);

  res.redirect(`/movies/${req.params.movieId}`);
});

router.get("/movies/:movieId/delete", isAuth, async (req, res) => {
  await movieService.delete(req.params.movieId);

  res.redirect("/");
});

module.exports = router;
