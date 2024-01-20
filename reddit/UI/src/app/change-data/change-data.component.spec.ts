import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDataComponent } from './change-data.component';

describe('ChangeDataComponent', () => {
  let component: ChangeDataComponent;
  let fixture: ComponentFixture<ChangeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
