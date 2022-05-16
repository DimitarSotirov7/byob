import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { CategoryService } from './services/category/category.service';
import { CategoryComponent } from './category/category.component';
import { CoreModule } from './core/core.module';
import { QuizComponent } from './quiz/quiz.component';
import { QuizService } from './services/quiz/quiz.service';
import { QuestionService } from './services/question/question.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CategoryComponent,
    QuizComponent,
  ],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase.config),
  ],
  providers: [
    CategoryService,
    QuizService,
    QuestionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
