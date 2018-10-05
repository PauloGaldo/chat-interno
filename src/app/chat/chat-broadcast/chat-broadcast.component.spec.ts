import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBroadcastComponent } from './chat-broadcast.component';

describe('ChatBroadcastComponent', () => {
  let component: ChatBroadcastComponent;
  let fixture: ComponentFixture<ChatBroadcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatBroadcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBroadcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
