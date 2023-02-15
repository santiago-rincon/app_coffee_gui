import { Component, OnInit } from '@angular/core';
import { listOfQuestions } from 'src/app/Data/questions';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent implements OnInit {
  questions = listOfQuestions;
  constructor() {}

  ngOnInit(): void {
  }
}
