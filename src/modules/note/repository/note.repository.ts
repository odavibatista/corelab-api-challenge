import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsOrder, In, Repository } from 'typeorm';
import { Note } from '../entity/note.entity';

@Injectable()
export class NoteRepository extends Repository<Note> {
  constructor(private dataSource: DataSource) {
    super(Note, dataSource.createEntityManager());
  }

  /* This method shall bring a single note by its individual id */
  async findById(id: number): Promise<Note | null> {
    return this.findOne({ where: { id_note: id } });
  }

  /* This method shall find a note by its title, to be used on the site's searchbar method */
  async findByTitle(user_id: number, title: string): Promise<Note | null> {
    return this.findOne({ where: { user_id, title } });
  }

  /* This method shall find all the notes belonging to a single user */
  async findUserNotes(user_id: number): Promise<Note[]> {
    return this.find({ where: { user_id } });
  }

  /* This method shall filter the user's notes by their color */
  async findUserNotesByColor(user_id: number, color: string): Promise<Note[]> {
    return this.find({ where: { user_id, color } });
  }

  /* This method shall find a single note by its title and user_id */
  async findNoteByTitle(user_id: number, title: string): Promise<Note | null> {
    return this.findOne({ where: { user_id, title } });
  }

  /* This method shall edit a note's data */
  async editNote(
    id: number,
    title: string,
    note_text: string,
    color: string, // Type this thing later
  ): Promise<Note> {
    const note = await this.findOne({ where: { id_note: id } });

    note.title = title;
    note.note_text = note_text;
    note.color = color;

    return this.save(note);
  }

  /* This method will make a soft delete on the note of the given id */
  async softDeleteById(id: number): Promise<true> {
    await this.softDelete(id);
    return;
  }
}
