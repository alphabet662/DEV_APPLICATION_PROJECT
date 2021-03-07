import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  DataTrack: any = [];
  showTrack: string = 'emtry';
  public inpTrackNo: string = "";
  constructor(private api:ApiService) { }

  ngOnInit(): void {}
  submitGetdata(inp: string){
  if (inp == "" || inp == " "){
    this.showTrack = 'null';
  }
  else{
      this.api.getShipmentWithID(inp).subscribe((res)=>{
      this.DataTrack = res;
      console.log(this.DataTrack);
      if (this.DataTrack.msg.length > 0) {
        this.showTrack = 'have';
      } else {
        this.showTrack = 'null';
    }
  });
}
}
}
