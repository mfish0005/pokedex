import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FishUi } from './fish-ui';

describe('FishUi', () => {
  let component: FishUi;
  let fixture: ComponentFixture<FishUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FishUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FishUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
