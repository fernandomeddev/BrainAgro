import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Check, Edit3, Factory, Leaf, MapPinned, Plus, RefreshCw, Sprout, Trash2, X } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import styled from 'styled-components';
import { fetchDashboard } from './store/dashboardSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  CreateFarmPayload,
  CreateProducerPayload,
  createFarm,
  createProducer,
  deleteProducer,
  fetchProducers,
  updateProducer
} from './store/producersSlice';

const COLORS = ['#2f7d59', '#d89c34', '#3d6f9f', '#b85c38', '#67706b'];
type ProducerDraft = { id: string; name: string; document: string };

export function App() {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector((state) => state.dashboard.data);
  const dashboardStatus = useAppSelector((state) => state.dashboard.status);
  const producers = useAppSelector((state) => state.producers.items);
  const producersError = useAppSelector((state) => state.producers.error);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isFarmSubmitting, setFarmSubmitting] = useState(false);
  const [deletingProducerId, setDeletingProducerId] = useState<string | null>(null);
  const [savingProducerId, setSavingProducerId] = useState<string | null>(null);
  const [producerDraft, setProducerDraft] = useState<ProducerDraft | null>(null);

  useEffect(() => {
    void dispatch(fetchDashboard());
    void dispatch(fetchProducers());
  }, [dispatch]);

  const landUseData = useMemo(
    () =>
      dashboard
        ? [
            { name: 'Agricultavel', value: dashboard.byLandUse.arableArea },
            { name: 'Vegetacao', value: dashboard.byLandUse.vegetationArea }
          ]
        : [],
    [dashboard]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload: CreateProducerPayload = {
      document: String(form.get('document')),
      name: String(form.get('producerName')),
      farms: [
        {
          name: String(form.get('farmName')),
          city: String(form.get('city')),
          state: String(form.get('state')),
          totalArea: Number(form.get('totalArea')),
          arableArea: Number(form.get('arableArea')),
          vegetationArea: Number(form.get('vegetationArea')),
          harvestCrops: [
            {
              harvest: String(form.get('harvest')),
              crop: String(form.get('crop'))
            }
          ].filter((item) => item.harvest && item.crop)
        }
      ]
    };

    try {
      await dispatch(createProducer(payload)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers())]);
      event.currentTarget.reset();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(producerId: string) {
    setDeletingProducerId(producerId);

    try {
      await dispatch(deleteProducer(producerId)).unwrap();
      await dispatch(fetchDashboard());
    } finally {
      setDeletingProducerId(null);
    }
  }

  async function handleFarmSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFarmSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload: CreateFarmPayload = {
      producerId: String(form.get('producerId')),
      farm: {
        name: String(form.get('farmName')),
        city: String(form.get('city')),
        state: String(form.get('state')),
        totalArea: Number(form.get('totalArea')),
        arableArea: Number(form.get('arableArea')),
        vegetationArea: Number(form.get('vegetationArea')),
        harvestCrops: [
          {
            harvest: String(form.get('harvest')),
            crop: String(form.get('crop'))
          }
        ].filter((item) => item.harvest && item.crop)
      }
    };

    try {
      await dispatch(createFarm(payload)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers())]);
      event.currentTarget.reset();
    } finally {
      setFarmSubmitting(false);
    }
  }

  async function handleUpdate() {
    if (!producerDraft) return;
    setSavingProducerId(producerDraft.id);

    try {
      await dispatch(updateProducer(producerDraft)).unwrap();
      setProducerDraft(null);
    } finally {
      setSavingProducerId(null);
    }
  }

  return (
    <Shell>
      <Sidebar>
        <Brand>
          <Sprout size={24} />
          <strong>Brain Agriculture</strong>
        </Brand>
        <NavItem $active>
          <BarChart3 size={18} />
          Dashboard
        </NavItem>
        <NavItem>
          <Factory size={18} />
          Produtores
        </NavItem>
      </Sidebar>

      <Main>
        <Topbar>
          <div>
            <Eyebrow>Operacao rural</Eyebrow>
            <h1>Produtores, propriedades e safras</h1>
          </div>
          <IconButton
            type="button"
            title="Atualizar dados"
            onClick={() => {
              void dispatch(fetchDashboard());
              void dispatch(fetchProducers());
            }}
          >
            <RefreshCw size={18} />
          </IconButton>
        </Topbar>

        {producersError ? <Alert role="alert">{normalizeApiError(producersError)}</Alert> : null}

        <Metrics>
          <Metric>
            <MapPinned size={20} />
            <span>Fazendas</span>
            <strong>{dashboard?.totalFarms ?? 0}</strong>
          </Metric>
          <Metric>
            <Leaf size={20} />
            <span>Hectares</span>
            <strong>{(dashboard?.totalArea ?? 0).toLocaleString('pt-BR')}</strong>
          </Metric>
          <Metric>
            <Sprout size={20} />
            <span>Produtores</span>
            <strong>{producers.length}</strong>
          </Metric>
        </Metrics>

        <Grid>
          <Panel>
            <PanelHeader>
              <h2>Uso do solo</h2>
            </PanelHeader>
            <ChartSlot>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie dataKey="value" data={landUseData} innerRadius={58} outerRadius={92} paddingAngle={3}>
                    {landUseData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartSlot>
          </Panel>

          <Panel>
            <PanelHeader>
              <h2>Estados</h2>
            </PanelHeader>
            <List>
              {(dashboard?.byState ?? []).map((item) => (
                <ListRow key={item.state}>
                  <span>{item.state}</span>
                  <strong>{item.total}</strong>
                </ListRow>
              ))}
              {dashboardStatus === 'succeeded' && !dashboard?.byState.length ? <Empty>Nenhuma fazenda cadastrada.</Empty> : null}
            </List>
          </Panel>

          <Panel>
            <PanelHeader>
              <h2>Culturas</h2>
            </PanelHeader>
            <List>
              {(dashboard?.byCrop ?? []).map((item) => (
                <ListRow key={item.crop}>
                  <span>{item.crop}</span>
                  <strong>{item.total}</strong>
                </ListRow>
              ))}
              {dashboardStatus === 'succeeded' && !dashboard?.byCrop.length ? <Empty>Nenhuma cultura registrada.</Empty> : null}
            </List>
          </Panel>

          <FormPanel onSubmit={handleSubmit}>
            <PanelHeader>
              <h2>Novo cadastro</h2>
              <SubmitButton disabled={isSubmitting}>
                <Plus size={16} />
                Salvar
              </SubmitButton>
            </PanelHeader>
            <Fields>
              <Input name="document" placeholder="CPF ou CNPJ" required />
              <Input name="producerName" placeholder="Nome do produtor" required />
              <Input name="farmName" placeholder="Nome da fazenda" required />
              <Input name="city" placeholder="Cidade" required />
              <Input name="state" placeholder="UF" maxLength={2} required />
              <Input name="totalArea" type="number" step="0.01" placeholder="Area total" required />
              <Input name="arableArea" type="number" step="0.01" placeholder="Area agricultavel" required />
              <Input name="vegetationArea" type="number" step="0.01" placeholder="Area vegetacao" required />
              <Input name="harvest" placeholder="Safra" />
              <Input name="crop" placeholder="Cultura" />
            </Fields>
          </FormPanel>

          <FormPanel onSubmit={handleFarmSubmit}>
            <PanelHeader>
              <h2>Nova fazenda</h2>
              <SubmitButton disabled={isFarmSubmitting || producers.length === 0}>
                <Plus size={16} />
                Salvar
              </SubmitButton>
            </PanelHeader>
            <Fields>
              <Select name="producerId" required defaultValue="">
                <option value="" disabled>
                  Produtor
                </option>
                {producers.map((producer) => (
                  <option key={producer.id} value={producer.id}>
                    {producer.name}
                  </option>
                ))}
              </Select>
              <Input name="farmName" placeholder="Nome da fazenda" required />
              <Input name="city" placeholder="Cidade" required />
              <Input name="state" placeholder="UF" maxLength={2} required />
              <Input name="totalArea" type="number" step="0.01" placeholder="Area total" required />
              <Input name="arableArea" type="number" step="0.01" placeholder="Area agricultavel" required />
              <Input name="vegetationArea" type="number" step="0.01" placeholder="Area vegetacao" required />
              <Input name="harvest" placeholder="Safra" />
              <Input name="crop" placeholder="Cultura" />
            </Fields>
          </FormPanel>
        </Grid>

        <Panel>
          <PanelHeader>
            <h2>Produtores cadastrados</h2>
          </PanelHeader>
          <Table>
            <thead>
              <tr>
                <th>Produtor</th>
                <th>Documento</th>
                <th>Fazendas</th>
                <th>Area total</th>
                <th aria-label="Acoes" />
              </tr>
            </thead>
            <tbody>
              {producers.map((producer) => {
                const isEditing = producerDraft?.id === producer.id;
                const isSaving = savingProducerId === producer.id;

                return (
                  <tr key={producer.id}>
                    <td>
                      {isEditing ? (
                        <InlineInput
                          value={producerDraft.name}
                          onChange={(event) => setProducerDraft({ ...producerDraft, name: event.target.value })}
                          aria-label="Nome do produtor"
                        />
                      ) : (
                        producer.name
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <InlineInput
                          value={producerDraft.document}
                          onChange={(event) => setProducerDraft({ ...producerDraft, document: event.target.value })}
                          aria-label="Documento do produtor"
                        />
                      ) : (
                        <>
                          {producer.documentType} {producer.document}
                        </>
                      )}
                    </td>
                    <td>{producer.farms.length}</td>
                    <td>
                      {producer.farms
                        .reduce((sum, farm) => sum + Number(farm.totalArea), 0)
                        .toLocaleString('pt-BR')}
                      ha
                    </td>
                    <td>
                      <Actions>
                        {isEditing ? (
                          <>
                            <IconButton type="button" title="Salvar alteracoes" disabled={isSaving} onClick={() => void handleUpdate()}>
                              <Check size={16} />
                            </IconButton>
                            <IconButton type="button" title="Cancelar edicao" disabled={isSaving} onClick={() => setProducerDraft(null)}>
                              <X size={16} />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              type="button"
                              title="Editar produtor"
                              onClick={() =>
                                setProducerDraft({
                                  id: producer.id,
                                  name: producer.name,
                                  document: producer.document
                                })
                              }
                            >
                              <Edit3 size={16} />
                            </IconButton>
                            <IconButton
                              type="button"
                              title="Excluir produtor"
                              disabled={deletingProducerId === producer.id}
                              onClick={() => {
                                void handleDelete(producer.id);
                              }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </>
                        )}
                      </Actions>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Panel>
      </Main>
    </Shell>
  );
}

function normalizeApiError(error: string) {
  if (error.includes('DOCUMENT_ALREADY_EXISTS')) return 'Ja existe um produtor cadastrado com este documento.';
  if (error.includes('INVALID_DOCUMENT')) return 'Informe um CPF ou CNPJ valido.';
  if (error.includes('INVALID_FARM_AREA')) return 'A soma das areas agricultavel e vegetacao nao pode ultrapassar a area total.';
  if (error.includes('PRODUCER_NOT_FOUND')) return 'Produtor nao encontrado.';
  if (error.includes('FARM_NOT_FOUND')) return 'Fazenda nao encontrada.';
  return 'Nao foi possivel concluir a operacao. Verifique os dados e tente novamente.';
}

const Shell = styled.div`
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  border-right: 1px solid #dde2d6;
  background: #ffffff;
  padding: 24px 18px;

  @media (max-width: 860px) {
    border-right: 0;
    border-bottom: 1px solid #dde2d6;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  color: #1f6b4a;
`;

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 10px;
  border-radius: 6px;
  color: ${({ $active }) => ($active ? '#173f2f' : '#64706a')};
  background: ${({ $active }) => ($active ? '#e7f2eb' : 'transparent')};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
`;

const Main = styled.main`
  padding: 28px;
`;

const Topbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  h1 {
    margin: 4px 0 0;
    font-size: clamp(1.6rem, 2.5vw, 2.4rem);
    letter-spacing: 0;
  }
`;

const Eyebrow = styled.span`
  color: #617068;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #cfd8ce;
  border-radius: 6px;
  background: #ffffff;
  color: #173f2f;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
`;

const Alert = styled.div`
  margin-bottom: 18px;
  border: 1px solid #e3b7a7;
  border-radius: 6px;
  padding: 12px 14px;
  color: #74351f;
  background: #fff4ef;
`;

const Metrics = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Metric = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 12px;
  align-items: center;
  padding: 16px;
  border: 1px solid #dde2d6;
  border-radius: 8px;
  background: #ffffff;

  span {
    color: #617068;
  }

  strong {
    grid-column: 1 / -1;
    font-size: 1.7rem;
  }
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 18px;

  @media (max-width: 1120px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  border: 1px solid #dde2d6;
  border-radius: 8px;
  background: #ffffff;
  padding: 16px;
`;

const FormPanel = styled.form`
  grid-column: span 3;
  border: 1px solid #dde2d6;
  border-radius: 8px;
  background: #ffffff;
  padding: 16px;

  @media (max-width: 1120px) {
    grid-column: span 2;
  }

  @media (max-width: 720px) {
    grid-column: span 1;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  h2 {
    margin: 0;
    font-size: 1rem;
  }
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border: 0;
  border-radius: 6px;
  color: #ffffff;
  background: #256f4f;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
`;

const ChartSlot = styled.div`
  height: 240px;
`;

const List = styled.div`
  display: grid;
  gap: 8px;
`;

const ListRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #eef1eb;
`;

const Empty = styled.p`
  margin: 0;
  color: #617068;
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 1120px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  width: 100%;
  min-height: 40px;
  border: 1px solid #cfd8ce;
  border-radius: 6px;
  padding: 0 10px;
  color: #17211d;
  background: #ffffff;
`;

const Select = styled.select`
  width: 100%;
  min-height: 40px;
  border: 1px solid #cfd8ce;
  border-radius: 6px;
  padding: 0 10px;
  color: #17211d;
  background: #ffffff;
`;

const InlineInput = styled(Input)`
  min-width: 180px;
  min-height: 36px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 10px;
    border-bottom: 1px solid #eef1eb;
    text-align: left;
  }

  th {
    color: #617068;
    font-size: 0.78rem;
    text-transform: uppercase;
  }

  th:last-child,
  td:last-child {
    width: 104px;
    text-align: right;
  }
`;
