import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngx-bromo-forms';

  formControl = new FormControl();
  dropdownItems = [{ display: 'static', value: 'staticValue' }];
  displayTransformer = 'display';

  ngOnInit() {
    this.formControl.setValue(2);
    this.formControl.valueChanges.subscribe(console.log);
  }

  onBtnClick = () => {
    this.displayTransformer = 'value';
    // this.dropdownItems = [
    //   { display: 'staticOne', value: 'staticValueOne' },
    //   { display: 'staticTwo', value: 'staticValueTwo' }
    // ];
  }
}
