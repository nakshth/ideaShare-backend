import { Db } from 'mongodb';
import Grid from 'gridfs-stream';
import mongoose from 'mongoose';

let gfs: any;

export const initializeGridFS = (db: Db) => {
  gfs = Grid(db, mongoose.mongo);
  gfs.collection('uploads');
};

export const getGridFS = () => gfs;
