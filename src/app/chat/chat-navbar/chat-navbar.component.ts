import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChatBroadcastComponent } from '../chat-broadcast/chat-broadcast.component';
import { DeepStreamService } from 'src/app/shared/services/deep-stream.service';

@Component({
    selector: 'ci-chat-navbar',
    templateUrl: './chat-navbar.component.html',
    styleUrls: ['./chat-navbar.component.scss']
})
export class ChatNavbarComponent implements OnInit {

    public user: string;
    constructor(public dialog: MatDialog, private deepStreamService: DeepStreamService) { }

    ngOnInit() {
      this.user = this.deepStreamService.user.username;
    }

    openBroadcast(): void {
        const unitManager = this.dialog.open(ChatBroadcastComponent, {
            width: `${600}px`,
            height: `${300}px`,
            data: {}
        });
    }

    /**
     * Imprimir chat de mensajes
     */
    printActualChat() {
        const printContent = document.getElementById('windowChatBox');
        const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
        WindowPrt.document.write('<html><head>' + '<style>' + `
            .message-wrapper {
              position: relative;
              overflow: hidden;
              width: 100%;
              margin: 10.6666666667px 0;
              padding: 10.6666666667px 0;
            }
            .message-wrapper .circle-wrapper {
              height: 42.6666666667px;
              width: 42.6666666667px;
              border-radius: 50%;
            }
            .message-wrapper .text-wrapper {
              padding: 10.6666666667px;
              min-height: 42.6666666667px;
              width: 60%;
              margin: 0 10.6666666667px;
              box-shadow: 0px 1px 0px 0px rgba(50, 50, 50, 0.3);
              border-radius: 2px;
              font-weight: 300;
              position: relative;
            }
            .message-wrapper .text-wrapper:before {
              content: "";
              width: 0;
              height: 0;
              border-style: solid;
            }
            .message-wrapper.them .circle-wrapper,
          .message-wrapper.them .text-wrapper {
              background: #F44336;
              float: left;
              color: #ffffff;
            }
            .message-wrapper.them .text-wrapper:before {
              border-width: 0 10px 10px 0;
              border-color: transparent #F44336 transparent transparent;
              position: absolute;
              top: 0;
              left: -9px;
            }
            .message-wrapper.me .circle-wrapper,
          .message-wrapper.me .text-wrapper {
              background: #FF5722;
              float: right;
              color: #ffffff;
            }
            .message-wrapper.me .text-wrapper {
              background: #2196F3;
            }
            .message-wrapper.me .text-wrapper:before {
              border-width: 10px 10px 0 0;
              border-color: #2196F3 transparent transparent transparent;
              position: absolute;
              top: 0;
              right: -9px;
            }
            </style>
            ` + '<title>Imprimir</title></head><body></body></html>');
        WindowPrt.document.write(printContent.innerHTML);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
    }


}
