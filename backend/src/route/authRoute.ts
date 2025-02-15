import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { signUp, login } from "../controller/auth";
import prisma from "../db";
import jwt from "jsonwebtoken";


const router = Router();

router.post('/signUp', signUp)
router.get('/login', login)


// Route for initiating Google login
router.get('/google/login', (req: Request, res: Response, next: NextFunction) => {
    req.query.action = 'login'; // Set action to 'login' for this route
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: 'login',
    })(req, res, next);
  });


  // Route for initiating Google login
router.get('/google/signup', (req: Request, res: Response, next: NextFunction) => {
    req.query.action = 'signup'; // Set action to 'login' for this route
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: 'signup',
    })(req, res, next);
  });

router.get('/google/callback', (req: Request, res:Response, next: NextFunction) => {
  passport.authenticate('google', async(err: Error | null, user: any) => {
    if (err) return next(err);

    const action = req.query.action || 'login'; // Default to 'login'
    if(!user) return res.redirect(`http://localhost:3000/${action}?error=google_login_failed`);

    let exisitingUser = await prisma.user.findUnique({
      where:{ 
        googleID: user.profile.id
    }});
    
    if(!exisitingUser && action === 'signup') {

      const { name, email, email_verified, picture } = user.profile._json;

      exisitingUser = await prisma.user.create({
        data:{
          name,
          email,
          googleID: user.profile.id,
          profileImage: picture,
          role: 'RESIDENT', // Default role
          referralSource: "Google OAuth",
          isVerified: email_verified,
          phone: ""
        }
      })
    }

    if (!exisitingUser) {
      return res.redirect('/login?error=Account not found. Please sign up.');
  }

  const token = jwt.sign({
    email: exisitingUser.email, 
    id: exisitingUser.id, 
    isverified: exisitingUser.isVerified}, 
    process.env.JWT_SECRET as string, {expiresIn: '1h'});

  res.redirect('/dashboard'); // Redirect after successful login
});

// 4 Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});

});
export default router;