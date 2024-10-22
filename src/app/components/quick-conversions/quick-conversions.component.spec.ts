import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickConversionsComponent } from './quick-conversions.component';

describe('QuickConversionsComponent', () => {
  let component: QuickConversionsComponent;
  let fixture: ComponentFixture<QuickConversionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickConversionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickConversionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
