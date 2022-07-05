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
import { QuestionComponent } from './question/question.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CategoryComponent,
    QuizComponent,
    QuestionComponent,
  ],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase.config),
    FormsModule
  ],
  exports: [
    QuestionComponent
  ],
  providers: [
    CategoryService,
    QuizService,
    QuestionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
