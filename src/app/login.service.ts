import { MessageService, Message } from './message/message.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {__await} from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public afAuth: AngularFireAuth, private messageService: MessageService) { }

  googleLogin() {
    __await(this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()));
  }

  facebookLogin() {
    __await(this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider()));
  }

  twitterLogin() {
    __await(this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider()));
  }

  gitHubLogin() {
    __await(this.afAuth.auth.signInWithPopup(new auth.GithubAuthProvider()));
  }

  signIn(form: any) {
    this.afAuth.auth.signInWithEmailAndPassword(form.email, form.password).then( (user) => {
      if (!user.user.emailVerified) {
        this.messageService.messages.push(new Message('Warning',
        `You need to verify your email (${user.user.email}) before logging in.`, 'alert-warning'));
        this.logout();
      }
    });
  }

  signUp(form: any) {
    this.afAuth.auth.createUserWithEmailAndPassword(form.email, form.password)
      .then( (user) => {
        this.messageService.messages.push(new Message('Success', `Your account has been created: ${user.user.email}`, 'alert-success'));
        __await(user.user.sendEmailVerification());
        this.afAuth.auth.signOut();
      })
      .then( () => {
        this.messageService.messages.push(new Message('Info', 'An Email verification has been sent to your email.', 'alert-info'));
      })
      .then( () => {
        this.logout();
        this.messageService.messages.push(new Message('Warning', 'You have been logged out until you verify your email.', 'alert-warning'));
      })
      .catch(function (error) {
        console.log('Error:', error);
      });
  }

  logout() {
    __await(this.afAuth.auth.signOut());
  }
}