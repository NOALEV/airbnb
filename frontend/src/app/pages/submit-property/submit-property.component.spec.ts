import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPropertyComponent } from './submit-property.component';

describe('SubmitPropertyComponent', () => {
  let component: SubmitPropertyComponent;
  let fixture: ComponentFixture<SubmitPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});