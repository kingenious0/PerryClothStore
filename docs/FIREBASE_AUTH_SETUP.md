# 🔥 FIREBASE AUTH SETUP REQUIRED

## ❌ Error: `auth/configuration-not-found`

This error means **Firebase Authentication is not enabled** in your Firebase Console.

---

## ✅ **HOW TO FIX (5 minutes)**

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com
2. Select your project: **perrystore-c7f53**

### Step 2: Enable Authentication
1. Click **"Authentication"** in the left sidebar
2. Click **"Get Started"** button
3. You'll see the Sign-in methods tab

### Step 3: Enable Sign-in Methods
Enable these methods (click each one and toggle "Enable"):

**Required:**
- ✅ **Email/Password** - Click, toggle "Enable", Save
- ✅ **Google** - Click, toggle "Enable", add your email, Save

**Optional (but recommended):**
- ✅ **Facebook** - Requires Facebook App ID (can skip for now)

### Step 4: Configure Authorized Domains
1. Go to **Authentication → Settings → Authorized domains**
2. Make sure these are added:
   - `localhost` ✅ (should be there by default)
   - `perrystore-c7f53.firebaseapp.com` ✅ (should be there)
   - Add your production domain when you deploy

---

## 🎯 **DETAILED STEPS WITH SCREENSHOTS**

### Enable Email/Password:
1. Authentication → Sign-in method
2. Click "Email/Password"
3. Toggle "Enable" to ON
4. Click "Save"

### Enable Google Sign-In:
1. Authentication → Sign-in method
2. Click "Google"
3. Toggle "Enable" to ON
4. Enter support email (your email)
5. Click "Save"

### Enable Facebook Sign-In (Optional):
1. Go to https://developers.facebook.com
2. Create an app
3. Get App ID and App Secret
4. In Firebase: Authentication → Sign-in method → Facebook
5. Toggle "Enable"
6. Paste App ID and App Secret
7. Copy the OAuth redirect URI
8. Add it to Facebook App settings
9. Click "Save"

---

## 🔧 **AFTER ENABLING**

1. **Restart your dev server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Test the authentication:**
   - Click User icon → Sign Up
   - Try creating an account
   - Should work now! ✅

---

## 🚨 **COMMON ISSUES**

### Issue: "Email/Password is not enabled"
**Solution:** Make sure you enabled it in Firebase Console and saved

### Issue: "Google Sign-In not working"
**Solution:** 
- Make sure you added a support email
- Check that localhost is in authorized domains

### Issue: "Facebook Sign-In not working"
**Solution:**
- Make sure you added the OAuth redirect URI to Facebook
- Check App ID and Secret are correct

---

## 📝 **WHAT EACH METHOD DOES**

### Email/Password
- Users sign up with email and password
- Email verification available
- Password reset available

### Google Sign-In
- One-click sign in with Google account
- No password needed
- Auto-creates user profile

### Facebook Sign-In
- One-click sign in with Facebook account
- No password needed
- Auto-creates user profile

---

## ✅ **VERIFICATION**

After enabling, you should be able to:
1. ✅ Click User icon → Sign Up
2. ✅ Create account with email/password
3. ✅ Sign in with Google
4. ✅ See user profile in Firebase Console → Authentication → Users

---

## 🎯 **QUICK START (Minimum Setup)**

**Just enable Email/Password for now:**
1. Firebase Console → Authentication → Get Started
2. Sign-in method → Email/Password → Enable → Save
3. Done! ✅

**You can enable Google/Facebook later.**

---

## 📞 **NEED HELP?**

If you're stuck:
1. Make sure you're in the correct Firebase project
2. Check that Authentication is initialized (not just Firestore)
3. Restart your dev server after enabling
4. Clear browser cache if needed

---

**Once you enable Email/Password authentication, the error will disappear! 🎉**

*Last Updated: 2026-02-02*
