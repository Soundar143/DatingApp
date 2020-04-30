import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  response: string;
  baseUrl = environment.apiUrl;
  currentMainPhoto: Photo;

  constructor(private auth: AuthService, private userService: UserService, private alert: AlertifyService) {}

  ngOnInit() {
    this.initializeUploader();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.auth.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024});
    // this.response = '';
    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };
    this.uploader.onSuccessItem = (item , response , status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
      }
    };
    // this.uploader.response.subscribe( res => this.response = res );
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.auth.decodedToken.nameid, photo.id).subscribe(() => {
      this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
      this.currentMainPhoto.isMain = false;
      photo.isMain = true;
      this.auth.changeMemberPhoto(photo.url);
      this.auth.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.auth.currentUser));
      this.alert.success('Profile pic updated successfully');
    }, error => {
      this.alert.error(error);
    });
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
}

deletePhoto(id: number) {
  this.alert.confirm('Are you sure you want to delete this photo', () => {
    this.userService.deletePhoto(this.auth.decodedToken.nameid, id).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
      this.alert.success('Photo has been deleted');
    }, error => {
      this.alert.error(error);
    });
  });
}
}

