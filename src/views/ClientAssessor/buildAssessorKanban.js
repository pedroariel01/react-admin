function buildConnectorKanban(connectors, status_connector) {
  let columns = {};
  let lands_result = { lanes: [] };

  for (var i = 0; i < status_connector.length; i++) {
    let status = status_connector[i];
    let new_column = {
      id: status.pk,
      title: status.name,
      style: {
        width: 280
      },
      cards: []
    };

    if (!(new_column.id in columns)) {
      columns[new_column.id] = new_column;
    }

    lands_result.lanes.push(new_column);
  }

  for (var i = 0; i < connectors.length; i++) {
    let connector = connectors[i];
    let status_connector = connector.status;
    let info_connector = `${connector.state} ${connector.county} ${connector.area}`;
    columns[status_connector.pk].cards.push({
      title: info_connector,
      id: connector.pk
    });
  }

  return lands_result;
}

export default buildConnectorKanban;
