import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OffreStage } from './offre-stage.model';
import { Entreprise } from 'src/entreprise/entreprise.model';
import { Etudiant } from 'src/etudiant/etudiant.model';

@Injectable()
export class OffreStageService {
    constructor( @InjectModel('OffreStage') private readonly offreStageModel : Model<OffreStage>,) {}
    async insertOffreStage(titre: string, description: string,domaine: string,candidatures: Array<Etudiant>,competences: Array<string>, localisation: string,date_debut: Date,date_fin: Date,entreprise: Entreprise){
        const newOffreStage = new this.offreStageModel({
            titre,
            description,
            domaine,
            candidatures,
            localisation,
            competences,
            date_debut,
            date_fin,
            entreprise,
        });
        const result = await newOffreStage.save();
        console.log(result);
        return result
    }
    async getOffresStage() {
      try {
          const offresStage = await this.offreStageModel.find().populate("entreprise").exec();
          return offresStage/*offresStage.map(offreStage => ({
              id: offreStage.id,
              titre: offreStage.titre,
              description: offreStage.description,
              domaine: offreStage.domaine,
              candidatures: offreStage.candidatures,
              localisation: offreStage.localisation,
              competences: offreStage.competences,
              date_debut: offreStage.date_debut,
              date_fin: offreStage.date_fin,
              entreprise: {
                id: offreStage.entreprise.id,
                user: offreStage.entreprise.user,
                localisation: offreStage.entreprise.localisation,
                secteur: offreStage.entreprise.secteur,
              }
          }));*/
      } catch (error) {
          console.error(error);
          throw new Error('Error fetching offresStage');
      }
  }
    async getSingleOffreStage(Id: string) {
        const offreStage = await this.findOffreStage(Id);
        return {
          id: offreStage.id,
          titre: offreStage.titre,
          description: offreStage.description,
          domaine: offreStage.domaine,
          candidatures: offreStage.candidatures,
          localisation: offreStage.localisation,
          competences: offreStage.competences,
          date_debut: offreStage.date_debut,
          date_fin: offreStage.date_fin,
        };
      }
    async updateOffreStage(Id: string, titre: string, description: string,domaine: string, competences: Array<string>, localisation: string,date_debut: Date,date_fin: Date){
        const updatedOffreStage = await this.findOffreStage(Id);
        if (titre) {
            updatedOffreStage.titre = titre;
          }
        if (description) {
            updatedOffreStage.description = description;
          }
        if (domaine) {
            updatedOffreStage.domaine = domaine;
          }
        if (competences) {
            updatedOffreStage.competences = competences;
          }
        
        if (localisation) {
            updatedOffreStage.localisation = localisation;
          }
        if (date_debut) {
            updatedOffreStage.date_debut = date_debut;
          }
        if (date_fin) {
            updatedOffreStage.date_fin = date_fin;
          }
        updatedOffreStage.save();
    }
    findOffreStage(Id: string): Promise<OffreStage> {
        let offreStage;
        try {
          offreStage = this.offreStageModel.findById(Id).exec();
        } catch (error) {
          throw new Error('Could not find offreStage.');
        }
        if (!offreStage) {
          throw new Error('Could not find offreStage.');
        }
        return offreStage;
        
    }
    async deleteOffreStage(Id: string){
        const result = await this.offreStageModel.deleteOne({_id: Id}).exec();
        if (result.deletedCount === 0) {
            throw new Error('Could not find offreStage.');
          }
    }
}
