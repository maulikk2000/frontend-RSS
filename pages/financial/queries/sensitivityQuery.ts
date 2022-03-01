export const getSensitivityQuery: string = `{
    sensitivities {
      id
      created
      name
      inputs {
        area
        cost
        timing
        revenue
        escalation
      }
      region
      tags
      updated
      type
      status
      scenarioId
      outputs {
        escalatedDCF {
          cost
          dcf
          gfa
          irr
          moc
          noi
          nvp
          revenue
          yoc
        }
        unescalatedDCF {
          cost
          dcf
          gfa
          irr
          moc
          noi
          nvp
          revenue
          yoc
        }
      }
      isBaseLine
    }
  }`;