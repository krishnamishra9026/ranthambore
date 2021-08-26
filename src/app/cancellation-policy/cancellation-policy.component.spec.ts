import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationPolicyComponent } from './cancellation-policy.component';

describe('CancellationPolicyComponent', () => {
  let component: CancellationPolicyComponent;
  let fixture: ComponentFixture<CancellationPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
