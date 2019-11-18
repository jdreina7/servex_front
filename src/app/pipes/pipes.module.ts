import { NgModule } from '@angular/core';
import { ImagePipe } from './image.pipe';
import { FilesPipe } from './files.pipe';


@NgModule({
  declarations: [
    ImagePipe,
    FilesPipe
  ],
  exports: [
    ImagePipe,
    FilesPipe
  ]
})
export class PipesModule { }
