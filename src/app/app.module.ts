import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageCardComponent } from './components/message-card/message-card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { DpComponent } from './components/dp/dp.component';
import { MessageComponent } from './components/message/message.component';
import { HeaderComponent } from './components/header/header.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { SentMessageComponent } from './components/sent-message/sent-message.component';
import { ReceiveMessageComponent } from './components/receive-message/receive-message.component';
import { HomeComponent } from './components/home/home.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MessageCardComponent,
    SearchBarComponent,
    SideBarComponent,
    UserProfileComponent,
    DpComponent,
    MessageComponent,
    HeaderComponent,
    ChatBoxComponent,
    SentMessageComponent,
    ReceiveMessageComponent,
    HomeComponent,
    LoginPageComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
